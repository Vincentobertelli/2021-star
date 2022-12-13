#!/usr/bin/env python

# get some color in earthly outputs
os.environ['FORCE_COLOR'] = '1'

secret_settings(disable_scrub=True)

config.define_bool("dev-frontend")
config.define_bool("dev-hlf-k8s")
config.define_bool("no-volumes")
config.define_string("env")
config.define_string_list('orgs', args=True)
cfg = config.parse()

env = cfg.get('env', 'dev')
orgs = cfg.get('orgs', ['rte'])

clk_k8s = 'clk --force-color k8s -c ' + k8s_context() + ' '

if config.tilt_subcommand == 'up':
    local(clk_k8s + 'helm dependency-update helm/star')
# manually download the dependencies
local_resource('helm dependencies',
               clk_k8s + 'helm-dependency-update helm/star -ft Tiltfile',
               trigger_mode=TRIGGER_MODE_MANUAL, auto_init=False)

# frontend build
if cfg.get('dev-frontend'):
    target='dev'
    extra_front_opts = {
        "live_update": [
            sync('frontend', '/app'),
            run('cd /usr/src/app && npm ci',
                trigger=['./package.json', './package.lock']),
        ]
    }
else:
    target='docker'
    extra_front_opts = {
        "live_update": [
            sync('frontend/nginx.conf', '/etc/nginx/conf.d/default.conf'),
            run('nginx -s reload', trigger=['./frontend/nginx.conf']),
        ]
    }
custom_build('eniblock/2021-star-frontend',
         'earthly ./frontend/+' + target + ' --ref=$EXPECTED_REF',
         ['frontend'],
         ignore=['frontend/dist'],
         **extra_front_opts)

# backend build
custom_build(
    'eniblock/2021-star-backend',
    'earthly ./backend/+dev --ref=$EXPECTED_REF',
    ['backend'],
)

# keycloak build
custom_build(
    'eniblock/2021-star-keycloak',
    'earthly ./keycloak/+docker --ref=$EXPECTED_REF',
    ['keycloak'],
    live_update=[
        sync('keycloak/configurator/', '/tf/'),
        # sync('keycloak/themes/base/login/', '/opt/keycloak/themes/base/login/'),
        sync('keycloak/theme/custom-theme', '/opt/keycloak/themes/extra/'),
    ]
)

# org instances

for org in orgs:
    if config.tilt_subcommand == 'up':
        # declare the host we'll be using locally in k8s dns
        local(clk_k8s + 'add-domain ' + org + '.localhost')

    k8s_yaml(
        helm(
            'helm/star',
            values=['./helm/star/values-' + org + '-' + env + '.yaml'],
            name='star',
            namespace=org
        )
    )

    #
    if len(orgs) == 1:
        k8s_resource('star-backend', labels=[org], port_forwards="5005:5005")
        k8s_resource('star-maildev', labels=[org], port_forwards="1080:80")
        k8s_resource('star-frontend', labels=[org])
        k8s_resource('star-keycloak', labels=[org])
        k8s_resource('star-keycloak-db', labels=[org])
    else:
        k8s_resource('star-backend:deployment:' + org, labels=[org])
        k8s_resource('star-maildev:deployment:' + org, labels=[org])
        k8s_resource('star-frontend:deployment:' + org, labels=[org])
        k8s_resource('star-keycloak:statefulset:' + org, labels=[org])
        k8s_resource('star-keycloak-db:statefulset:' + org, labels=[org])

    if config.tilt_subcommand == 'down' and not cfg.get("no-volumes"):
        local(
            'kubectl --context ' + k8s_context()
            + ' delete pvc --selector=app.kubernetes.io/instance=star --namespace ' + org + ' --wait=false'
        )

local_resource('helm lint', 'earthly ./helm/+lint', './helm', allow_parallel=True)


############################# hlf #############################

hlf_k8s_version = [l for l in str(read_file('./helm/Earthfile')).splitlines() if l.startswith('ARG hlf_k8s_version=')][0].split('=')[1]

# image build
custom_build(
    'eniblock/2021-star-chaincode',
    'earthly ./chaincode/+docker --ref=$EXPECTED_REF',
    ['chaincode'],
)

if cfg.get('dev-hlf-k8s'):
    custom_build('eniblock/hlf-helper', 'earthly ../hlf/helper+docker --ref=$EXPECTED_REF', ["../hlf/helper"])
    custom_build('eniblock/hlf-ccid', 'earthly ../hlf/ccid+docker --ref=$EXPECTED_REF', ["../hlf/ccid"])


load('ext://namespace', 'namespace_create')
load('ext://helm_remote', 'helm_remote')

namespace_create('orderer')
namespace_create('enedis')
namespace_create('rte')
namespace_create('producer')

kc_secret = 'kubectl create secret --dry-run=client -o yaml '

dk_run = 'docker run --rm -u $(id -u):$(id -g) -v $PWD/hlf/' + env + ':/hlf/' + env + ' hyperledger/fabric-tools:2.3 '
if not os.path.exists('./hlf/' + env + '/generated/crypto-config'):
    local(dk_run + ' cryptogen generate --config=/hlf/' + env + '/crypto-config.yaml --output=/hlf/' + env + '/generated/crypto-config')
if not os.path.exists('./hlf/' + env + '/generated/genesis.block'):
    local(dk_run + 'env FABRIC_CFG_PATH=/hlf/' + env + ' configtxgen -profile TwoOrgsOrdererGenesis -channelID system-channel -outputBlock /hlf/' + env + '/generated/genesis.block')
if not os.path.exists('./hlf/' + env + '/generated/star.tx'):
    local(dk_run + 'env FABRIC_CFG_PATH=/hlf/' + env + ' configtxgen -profile TwoOrgsChannel -outputCreateChannelTx /hlf/' + env + '/generated/star.tx -channelID star')

for org in ['enedis', 'producer', 'rte']:
    if not os.path.exists('./hlf/' + env + '/generated/anchor-star-' + org + '.tx'):
        local(dk_run + 'env FABRIC_CFG_PATH=/hlf/' + env + ' configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate /hlf/' + env + '/generated/anchor-star-' + org + '.tx -channelID star -asOrg ' + org)

secret_path = './hlf/' + env + '/generated/secrets.yaml'
if not os.path.exists(secret_path):
    def generate_secret(param):
        local('echo --- >> ' + secret_path, quiet=True)
        local(kc_secret + param + ' >> ' + secret_path, quiet=True)

    generate_secret('-n orderer generic hlf--genesis --from-file=./hlf/' + env + '/generated/genesis.block')
    generate_secret('-n orderer generic hlf--ord-admincert --from-file=cert.pem=./hlf/' + env + '/generated/crypto-config/ordererOrganizations/orderer/users/Admin@orderer/msp/signcerts/Admin@orderer-cert.pem')
    for orderer in ['orderer1', 'orderer2', 'orderer3']:
        generate_secret('-n orderer generic hlf--' + orderer + '-idcert --from-file=./hlf/' + env + '/generated/crypto-config/ordererOrganizations/orderer/orderers/' + orderer + '.orderer/msp/signcerts/' + orderer + '.orderer-cert.pem')
        generate_secret('-n orderer generic hlf--' + orderer + '-idkey --from-file=./hlf/' + env + '/generated/crypto-config/ordererOrganizations/orderer/orderers/' + orderer + '.orderer/msp/keystore/priv_sk')
        generate_secret('-n orderer generic hlf--' + orderer + '-cacert --from-file=./hlf/' + env + '/generated/crypto-config/ordererOrganizations/orderer/orderers/' + orderer + '.orderer/msp/cacerts/ca.orderer-cert.pem')
        generate_secret('-n orderer tls hlf--' + orderer + '-tls --key=./hlf/' + env + '/generated/crypto-config/ordererOrganizations/orderer/orderers/' + orderer + '.orderer/tls/server.key --cert=./hlf/' + env + '/generated/crypto-config/ordererOrganizations/orderer/orderers/' + orderer + '.orderer/tls/server.crt')
        generate_secret('-n orderer generic hlf--' + orderer + '-tlsrootcert --from-file=cacert.pem=./hlf/' + env + '/generated/crypto-config/ordererOrganizations/orderer/orderers/' + orderer + '.orderer/tls/ca.crt')

    for org in ['enedis', 'rte', 'producer']:
        local('./hlf/dev/ccp-generate.sh ' + org)
        local('./hlf/dev/user-generate.sh ' + org)
        generate_secret('-n ' + org + ' generic star-peer-connection --from-file=connection.yaml=./hlf/' + env + '/generated/crypto-config/peerOrganizations/' + org + '/connection-' + org + '.yaml')
        generate_secret('-n ' + org + ' generic star-user-id --from-file=User1.id=./hlf/' + env + '/generated/crypto-config/peerOrganizations/' + org + '/User1.id')
        generate_secret('-n ' + org + ' generic starchannel --from-file=./hlf/' + env + '/generated/star.tx --from-file=./hlf/' + env + '/generated/anchor-star-' + org + '.tx')
        generate_secret('-n ' + org + ' generic hlf--ord-tlsrootcert --from-file=cacert.pem=./hlf/' + env + '/generated/crypto-config/ordererOrganizations/orderer/orderers/orderer1.orderer/tls/ca.crt')
        for peer in ['peer1']:
            generate_secret('-n ' + org + ' generic hlf--' + peer + '-idcert --from-file=./hlf/' + env + '/generated/crypto-config/peerOrganizations/' + org + '/peers/' + peer + '.' + org + '/msp/signcerts/' + peer + '.' + org + '-cert.pem')
            generate_secret('-n ' + org + ' generic hlf--' + peer + '-idkey --from-file=./hlf/' + env + '/generated/crypto-config/peerOrganizations/' + org + '/peers/' + peer + '.' + org + '/msp/keystore/priv_sk')
            generate_secret('-n ' + org + ' generic hlf--' + peer + '-cacert --from-file=./hlf/' + env + '/generated/crypto-config/peerOrganizations/' + org + '/peers/' + peer + '.' + org + '/msp/cacerts/ca.' + org + '-cert.pem')

            generate_secret('-n ' + org + ' tls hlf--' + peer + '-tls --key=./hlf/' + env + '/generated/crypto-config/peerOrganizations/' + org + '/peers/' + peer + '.' + org + '/tls/server.key --cert=./hlf/' + env + '/generated/crypto-config/peerOrganizations/' + org + '/peers/' + peer + '.' + org + '/tls/server.crt')
            generate_secret('-n ' + org + ' generic hlf--' + peer + '-tlsrootcert --from-file=cacert.pem=./hlf/' + env + '/generated/crypto-config/peerOrganizations/' + org + '/peers/' + peer + '.' + org + '/tls/ca.crt')

            generate_secret('-n ' + org + ' tls hlf--' + peer + '-tls-client --key=./hlf/' + env + '/generated/crypto-config/peerOrganizations/' + org + '/users/Admin@' + org + '/tls/client.key --cert=./hlf/' + env + '/generated/crypto-config/peerOrganizations/' + org + '/users/Admin@' + org + '/tls/client.crt')
            generate_secret('-n ' + org + ' generic hlf--' + peer + '-client-tlsrootcert --from-file=./hlf/' + env + '/generated/crypto-config/peerOrganizations/' + org + '/users/Admin@' + org + '/tls/ca.crt')

            generate_secret('-n ' + org + ' generic hlf--' + peer + '-admincert --from-file=cert.pem=./hlf/' + env + '/generated/crypto-config/peerOrganizations/' + org + '/users/Admin@' + org + '/msp/signcerts/Admin@' + org + '-cert.pem')
            generate_secret('-n ' + org + ' generic hlf--' + peer + '-adminkey --from-file=cert.pem=./hlf/' + env + '/generated/crypto-config/peerOrganizations/' + org + '/users/Admin@' + org + '/msp/keystore/priv_sk')

k8s_yaml(read_file(secret_path))

def hlf_k8s_helm(chart, name, namespace, values):
    if cfg.get('dev-hlf-k8s'):
        k8s_yaml(helm('../hlf/helm/' + chart, namespace=namespace, name=name, values=values))
    else:
        helm_remote(chart, repo_name='oci://ghcr.io/eniblock', version=hlf_k8s_version, namespace=namespace,
                    release_name=name, values=values)

#### orderers ####

for org in ['enedis', 'producer', 'rte']:
    values = 'helm/hlf-ord/values-' + org + '-dev.yaml'
    orderer = read_yaml(values)['releaseName']
    hlf_k8s_helm('hlf-ord', orderer, 'orderer', [values])
    k8s_resource(orderer + '-hlf-ord', labels=['orderer'])
    if config.tilt_subcommand == 'up':
        local(clk_k8s + 'add-domain ' + orderer + '.orderer.localhost')
    if config.tilt_subcommand == 'down' and not cfg.get("no-volumes"):
        local('kubectl --context ' + k8s_context() + ' -n orderer delete pvc --selector=app.kubernetes.io/instance=' + orderer + ' --wait=false')

#### peers ####

for org in ['enedis', 'rte', 'producer']:
    for peer in ['peer1']:
        hlf_k8s_helm('hlf-peer', peer, org, ['helm/hlf-peer/values-' + org + '-' + env + '-' + peer + '.yaml'])

        k8s_resource(peer + '-hlf-peer:statefulset:' + org, labels=[org])
        k8s_resource(peer + '-hlf-peer-couchdb:statefulset:' + org, labels=[org])
        k8s_resource(peer + '-hlf-peer-star:deployment:' + org, labels=[org])
        k8s_resource(peer + '-hlf-peer-jc-star:job:' + org, labels=[org])
        k8s_resource(peer + '-hlf-peer-rc-star:job:' + org, labels=[org])

        if config.tilt_subcommand == 'up':
            local(clk_k8s + 'add-domain ' + peer + '.' + org + '.localhost')
        if config.tilt_subcommand == 'down' and not cfg.get("no-volumes"):
            local('kubectl --context ' + k8s_context() + ' -n ' + org + ' delete pvc --selector=app.kubernetes.io/instance=' + peer + ' --wait=false')
