
'use strict';
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

import { ChaincodeStub, ClientIdentity } from 'fabric-shim'

import { Star } from '../src/star'
import { EnergyAccount } from '../src/model/energyAccount';
import { STARParameters } from '../src/model/starParameters';

import { ParametersController } from '../src/controller/ParametersController';
import { ParametersType } from '../src/enums/ParametersType';
import { OrganizationTypeMsp } from '../src/enums/OrganizationMspType';

import { Values } from './Values';
import { DocType } from '../src/enums/DocType';
import { QueryStateService } from '../src/controller/service/QueryStateService';
import { HLFServices } from '../src/controller/service/HLFservice';


class TestLoggerMgt {
    public getLogger(arg: string): any {
        return console;
    }
}

class TestContext {
    clientIdentity: any;
    stub: any;
    logger: TestLoggerMgt= new TestLoggerMgt();

    constructor() {
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.clientIdentity.getMSPID.returns(Values.FakeMSP);
        this.stub = sinon.createStubInstance(ChaincodeStub);
    }
}

function ChaincodeMessageHandler(ChaincodeMessageHandler: any): any {
    throw new Error('Function not implemented.');
}

describe('Star Tests EnergyAccount', () => {
    let transactionContext: any;
    let mockHandler:any;
    let star: Star;
    beforeEach(() => {
        transactionContext = new TestContext();
        star = new Star();
        mockHandler = sinon.createStubInstance(ChaincodeMessageHandler);

        chai.should();
        chai.use(chaiAsPromised);
        chai.use(sinonChai);
    });

    describe('Test false statement', () => {
        it('should avoid else flag missing', async () => {
            await transactionContext.stub.getState("EolienFRvert28EIC");
            await transactionContext.stub.getQueryResult("EolienFRvert28EIC");
        });
    });

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////    HTA     ////////////////////////////
////////////////////////////////////////////////////////////////////////////

    describe('Test CreateEnergyAccount HTA', () => {
        // it('should return ERROR on CreateEnergyAccount', async () => {
        //     transactionContext.stub.putState.rejects('failed inserting key');

        //     let star = new Star();
        //     transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.RTE);
        //     try {
        //         await star.CreateSystemOperator(transactionContext, '17V000000992746D', 'RTE', 'A49');
        //         // await star.createProducer(transactionContext, '17X000001309745X', 'EolienFR vert Cie', 'A21');
        //         await star.CreateEnergyAccount(transactionContext, '{\"meteringPointMrid\":\"PDL00000000289766\",\"systemOperatorMarketParticipantMrid\":\"17V000000992746D\",\"producerMarketParticipantMrid\":\"17X000001309745X\",\"technologyType\": \"Eolien\",\"siteType\":\"Injection\",\"siteName\":\"Ferme éolienne de Genonville\",\"substationMrid\":\"GDO A4RTD\",\"substationName\":\"CIVRAY\",\"marketEvaluationPointMrid\":\"string\",\"schedulingEntityRegisteredResourceMrid\":\"string\",\"siteAdminMrid\":\"489 981 029\",\"siteLocation\":\"Biscarosse\",\"siteIecCode\":\"S7X0000013077478\",\"systemOperatorEntityFlexibilityDomainMrid\":\"PSC4511\",\"systemOperatorEntityFlexibilityDomainName\":\"Départ 1\",\"systemOperatorCustomerServiceName\":\"DR Nantes Deux-Sèvres\"}');
        //     } catch(err) {
        //         params.logger.info(err.message)
        //         expect(err.message).to.equal('failed inserting key');
        //     }
        // });

        it('should return ERROR on CreateEnergyAccount NON-JSON Value', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.RTE);
            try {
                await star.CreateEnergyAccount(transactionContext, 'RTE01EIC');
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('ERROR '.concat(DocType.ENERGY_ACCOUNT).concat(' -> Input string NON-JSON value'));
            }
        });

        it('should return ERROR CreateEnergyAccount missing energyAccountMarketDocumentMrid', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            // const date = new Date(1634898550000);
            // params.logger.log("date=", date);
            const nrj : EnergyAccount = {
                energyAccountMarketDocumentMrid: "ea4cef73-ff6b-400b-8957-d34000eb30a3",
                meteringPointMrid: "PRM50012536123456",
                // marketEvaluationPointMrid: "CodePPE",
                areaDomain: "17X100A100A0001A",
                senderMarketParticipantMrid: "17V0000009927454",
                senderMarketParticipantRole: "A50",
                receiverMarketParticipantMrid: "Producteur1",
                receiverMarketParticipantRole: "A32",
                createdDateTime: "2021-10-22T10:29:10.000Z",
                measurementUnitName: "KW",
                timeInterval: "2021-10-22T10:29:10.000Z",
                resolution: "PT10M",
                timeSeries: [{ inQuantity: 7500, position: 3 }, { inQuantity: 7500, position: 3 }],
                revisionNumber: "1",
                businessType: "A14 / Z14",
                docStatus: "A02",
                processType: "A05",
                classificationType: "A02",
                product: "Energie active/Réactive",
                startCreatedDateTime: '',
                endCreatedDateTime: '',
            };

            // `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`

            try {
                await star.CreateEnergyAccount(transactionContext,
                 `{\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`
                 );
                // await star.CreateEnergyAccount(transactionContext, JSON.stringify(nrj));
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('energyAccountMarketDocumentMrid is a compulsory string');
            }
        });

        it('should return ERROR CreateEnergyAccount missing meteringPointMrid', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            // `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`

            try {
                await star.CreateEnergyAccount(transactionContext,
                 `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`
                 );
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('meteringPointMrid is a compulsory string');
            }
        });

        it('should return ERROR CreateEnergyAccount missing senderMarketParticipantMrid', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            // `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`

            try {
                await star.CreateEnergyAccount(transactionContext,
                 `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`
                 );
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('senderMarketParticipantMrid is a compulsory string');
            }
        });

        it('should return ERROR CreateEnergyAccount missing senderMarketParticipantRole', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            // `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`

            try {
                await star.CreateEnergyAccount(transactionContext,
                 `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`
                 );
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('senderMarketParticipantRole is a compulsory string');
            }
        });

        it('should return ERROR CreateEnergyAccount missing receiverMarketParticipantMrid', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            // `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`

            try {
                await star.CreateEnergyAccount(transactionContext,
                 `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`
                 );
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('receiverMarketParticipantMrid is a compulsory string');
            }
        });

        it('should return ERROR CreateEnergyAccount missing receiverMarketParticipantRole', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            // `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`

            try {
                await star.CreateEnergyAccount(transactionContext,
                 `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`
                 );
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('receiverMarketParticipantRole is a compulsory string');
            }
        });

        it('should return ERROR CreateEnergyAccount missing createdDateTime', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            // `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`

            try {
                await star.CreateEnergyAccount(transactionContext,
                 `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`
                 );
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('createdDateTime is a required field');
            }
        });

        it('should return ERROR CreateEnergyAccount missing measurementUnitName', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            // `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`

            try {
                await star.CreateEnergyAccount(transactionContext,
                 `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`
                 );
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('measurementUnitName is a compulsory string');
            }
        });

        it('should return ERROR CreateEnergyAccount missing timeInterval', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            // `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`

            try {
                await star.CreateEnergyAccount(transactionContext,
                 `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`
                 );
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('timeInterval is a required field');
            }
        });

        it('should return ERROR CreateEnergyAccount missing resolution', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            // `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`

            try {
                await star.CreateEnergyAccount(transactionContext,
                 `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`
                 );
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('resolution is a compulsory string');
            }
        });

        it('should return ERROR CreateEnergyAccount missing timeSeries', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            // `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`

            try {
                await star.CreateEnergyAccount(transactionContext,
                 `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`
                 );
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('timeSeries is a required field');
            }
        });

        it('should return ERROR CreateEnergyAccount missing inQuantity in timeSeries', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            // `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`

            try {
                await star.CreateEnergyAccount(transactionContext,
                 `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`
                 );
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('timeSeries[0].inQuantity is a required field');
            }
        });

        it('should return ERROR CreateEnergyAccount missing position in timeSeries', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            // `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500,\"position\":3}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`

            try {
                await star.CreateEnergyAccount(transactionContext,
                 `{\"energyAccountMarketDocumentMrid\":\"ea4cef73-ff6b-400b-8957-d34000eb30a3\",\"meteringPointMrid\":\"PRM50012536123456\",\"areaDomain\":\"17X100A100A0001A\",\"senderMarketParticipantMrid\":\"17V0000009927454\",\"senderMarketParticipantRole\":\"A50\",\"receiverMarketParticipantMrid\":\"Producteur1\",\"receiverMarketParticipantRole\":\"A32\",\"createdDateTime\":\"2021-10-22T10:29:10.000Z\",\"measurementUnitName\":\"KW\",\"timeInterval\":\"2021-10-22T10:29:10.000Z\",\"resolution\":\"PT10M\",\"timeSeries\":[{\"inQuantity\":7500,\"position\":3},{\"inQuantity\":7500}],\"revisionNumber\":\"1\",\"businessType\":\"A14 / Z14\",\"docStatus\":\"A02\",\"processType\":\"A05\",\"classificationType\":\"A02\",\"product\":\"Energie active/Réactive\"}`
                 );
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('timeSeries[1].position is a required field');
            }
        });

        it('should return ERROR CreateEnergyAccount Wrong MSPID', async () => {
            // const date = new Date(1634898550000);
            // params.logger.log("date=", date);
            const nrj : EnergyAccount = {
                energyAccountMarketDocumentMrid: "ea4cef73-ff6b-400b-8957-d34000eb30a3",
                meteringPointMrid: "PRM50012536123456",
                // marketEvaluationPointMrid: "CodePPE",
                areaDomain: "17X100A100A0001A",
                senderMarketParticipantMrid: "17V0000009927454",
                senderMarketParticipantRole: "A50",
                receiverMarketParticipantMrid: "Producteur1",
                receiverMarketParticipantRole: "A32",
                createdDateTime: "2021-10-22T10:29:10.000Z",
                measurementUnitName: "KW",
                timeInterval: "2021-10-22T10:29:10.000Z",
                resolution: "PT10M",
                timeSeries: [{ inQuantity: 7500, position: 3 }, { inQuantity: 7500, position: 3 }],
                revisionNumber: "1",
                businessType: "A14 / Z14",
                docStatus: "A02",
                processType: "A05",
                classificationType: "A02",
                product: "Energie active/Réactive",
                startCreatedDateTime: '',
                endCreatedDateTime: '',
            };

            try {
                await star.CreateEnergyAccount(transactionContext, JSON.stringify(nrj));
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal(`Organisation, ${Values.FakeMSP} does not have rights for Energy Account.`);
            }
        });

        it('should return ERROR CreateEnergyAccount missing Site', async () => {

            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);

            // const date = new Date(1634898550000);
            const nrj : EnergyAccount = JSON.parse(JSON.stringify(Values.HTA_EnergyAccount_a3));

            try {
                await star.CreateEnergyAccount(transactionContext, JSON.stringify(nrj));
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('ERROR createEnergyAccount : '.concat(DocType.SITE).concat(' : PDLHTA10000289766 does not exist (not found in any collection). for Energy Account ea4cef73-ff6b-400b-8957-d34000eb30a3 creation.'));
            }
        });


        it('should return ERROR CreateEnergyAccount Time Series not enough points', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            transactionContext.stub.getState.withArgs(Values.HTA_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_systemoperator)));
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collections: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateData.withArgs(collections[0], Values.HTA_site_valid.meteringPointMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_site_valid)));

            var nrjObj: EnergyAccount = JSON.parse(JSON.stringify(Values.HTA_EnergyAccount_a3));
            nrjObj.timeSeries.pop();

            try {
                await star.CreateEnergyAccount(transactionContext, JSON.stringify(nrjObj));
            } catch (err) {
                expect(err.message).to.equal(`ERROR createEnergyAccount : timeSeries[${nrjObj.timeSeries.length}] does not respect the expected number of points 144 for Energy Account ${nrjObj.energyAccountMarketDocumentMrid} creation.`);
            }

        });

        it('should return ERROR CreateEnergyAccount Time Series too much points', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            transactionContext.stub.getState.withArgs(Values.HTA_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_systemoperator)));
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collections: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateData.withArgs(collections[0], Values.HTA_site_valid.meteringPointMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_site_valid)));

            var nrjObj: EnergyAccount = JSON.parse(JSON.stringify(Values.HTA_EnergyAccount_a3));
            nrjObj.timeSeries.push({"position":1,"inQuantity":3822});

            try {
                await star.CreateEnergyAccount(transactionContext, JSON.stringify(nrjObj));
            } catch (err) {
                expect(err.message).to.equal(`ERROR createEnergyAccount : timeSeries[${nrjObj.timeSeries.length}] does not respect the expected number of points 144 for Energy Account ${nrjObj.energyAccountMarketDocumentMrid} creation.`);
            }

        });


        it('should return SUCCESS CreateEnergyAccount HTA', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            transactionContext.stub.getState.withArgs(Values.HTA_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_systemoperator)));
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collections: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateData.withArgs(collections[0], Values.HTA_site_valid.meteringPointMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_site_valid)));

            await star.CreateEnergyAccount(transactionContext, JSON.stringify(Values.HTA_EnergyAccount_a3));

            const expected = JSON.parse(JSON.stringify(Values.HTA_EnergyAccount_a3))
            expected.docType = DocType.ENERGY_ACCOUNT;
            transactionContext.stub.putPrivateData.should.have.been.calledWithExactly(
                collections[0],
                Values.HTA_EnergyAccount_a3.energyAccountMarketDocumentMrid,
                Buffer.from(JSON.stringify(expected))
            );

            expect(transactionContext.stub.putPrivateData.callCount).to.equal(1);
        });


        it('should return Error CreateEnergyAccount HTA - Hour Change Spring Less 1H not enough points', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            transactionContext.stub.getState.withArgs(Values.HTA_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_systemoperator)));
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collections: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateData.withArgs(collections[0], Values.HTA_site_valid.meteringPointMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_site_valid)));

            var nrjObj: EnergyAccount = JSON.parse(JSON.stringify(Values.HTA_EnergyAccount_a3));
            const lapTimeLess1HDays: string[] = params.values.get(ParametersType.ENERGY_ACCOUNT_TIME_INTERVAL_LAPsec_LESS1H_DAYS);
            nrjObj.startCreatedDateTime = lapTimeLess1HDays[0];

            nrjObj.timeSeries.pop();
            nrjObj.timeSeries.pop();
            nrjObj.timeSeries.pop();
            nrjObj.timeSeries.pop();
            nrjObj.timeSeries.pop();
            nrjObj.timeSeries.pop();
            nrjObj.timeSeries.pop();

            try {
                await star.CreateEnergyAccount(transactionContext, JSON.stringify(nrjObj));
            } catch (err) {
                expect(err.message).to.equal(`ERROR createEnergyAccount : timeSeries[${nrjObj.timeSeries.length}] does not respect the expected number of points 138 for Energy Account ${nrjObj.energyAccountMarketDocumentMrid} creation.`);
            }
        });


        it('should return Error CreateEnergyAccount HTA - Hour Change Spring Less 1H too much points', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            transactionContext.stub.getState.withArgs(Values.HTA_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_systemoperator)));
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collections: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateData.withArgs(collections[0], Values.HTA_site_valid.meteringPointMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_site_valid)));

            var nrjObj: EnergyAccount = JSON.parse(JSON.stringify(Values.HTA_EnergyAccount_a3));
            const lapTimeLess1HDays: string[] = params.values.get(ParametersType.ENERGY_ACCOUNT_TIME_INTERVAL_LAPsec_LESS1H_DAYS);
            nrjObj.startCreatedDateTime = lapTimeLess1HDays[0];

            nrjObj.timeSeries.pop();
            nrjObj.timeSeries.pop();
            nrjObj.timeSeries.pop();
            nrjObj.timeSeries.pop();
            nrjObj.timeSeries.pop();

            try {
                await star.CreateEnergyAccount(transactionContext, JSON.stringify(nrjObj));
            } catch (err) {
                expect(err.message).to.equal(`ERROR createEnergyAccount : timeSeries[${nrjObj.timeSeries.length}] does not respect the expected number of points 138 for Energy Account ${nrjObj.energyAccountMarketDocumentMrid} creation.`);
            }
        });



        it('should return SUCCESS CreateEnergyAccount HTA - Hour Change Spring Less 1H', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            transactionContext.stub.getState.withArgs(Values.HTA_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_systemoperator)));
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collections: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateData.withArgs(collections[0], Values.HTA_site_valid.meteringPointMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_site_valid)));

            var nrjObj: EnergyAccount = JSON.parse(JSON.stringify(Values.HTA_EnergyAccount_a3));
            const lapTimeLess1HDays: string[] = params.values.get(ParametersType.ENERGY_ACCOUNT_TIME_INTERVAL_LAPsec_LESS1H_DAYS);
            nrjObj.startCreatedDateTime = lapTimeLess1HDays[0];

            nrjObj.timeSeries.pop();
            nrjObj.timeSeries.pop();
            nrjObj.timeSeries.pop();
            nrjObj.timeSeries.pop();
            nrjObj.timeSeries.pop();
            nrjObj.timeSeries.pop();
            await star.CreateEnergyAccount(transactionContext, JSON.stringify(nrjObj));

            const expected = JSON.parse(JSON.stringify(nrjObj))
            expected.docType = DocType.ENERGY_ACCOUNT;
            transactionContext.stub.putPrivateData.should.have.been.calledWithExactly(
                collections[0],
                nrjObj.energyAccountMarketDocumentMrid,
                Buffer.from(JSON.stringify(expected))
            );

            expect(transactionContext.stub.putPrivateData.callCount).to.equal(1);
        });



        it('should return Error CreateEnergyAccount HTA - Hour Change Autumn Plus 1H not enough points', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            transactionContext.stub.getState.withArgs(Values.HTA_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_systemoperator)));
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collections: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateData.withArgs(collections[0], Values.HTA_site_valid.meteringPointMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_site_valid)));

            var nrjObj: EnergyAccount = JSON.parse(JSON.stringify(Values.HTA_EnergyAccount_a3));
            const lapTimePlus1HDays: string[] = params.values.get(ParametersType.ENERGY_ACCOUNT_TIME_INTERVAL_LAPsec_PLUS1H_DAYS);
            nrjObj.startCreatedDateTime = lapTimePlus1HDays[0];

            nrjObj.timeSeries.push({"position":1,"inQuantity":3822});
            nrjObj.timeSeries.push({"position":1,"inQuantity":3822});
            nrjObj.timeSeries.push({"position":1,"inQuantity":3822});
            nrjObj.timeSeries.push({"position":1,"inQuantity":3822});
            nrjObj.timeSeries.push({"position":1,"inQuantity":3822});

            try {
                await star.CreateEnergyAccount(transactionContext, JSON.stringify(nrjObj));
            } catch (err) {
                expect(err.message).to.equal(`ERROR createEnergyAccount : timeSeries[${nrjObj.timeSeries.length}] does not respect the expected number of points 150 for Energy Account ${nrjObj.energyAccountMarketDocumentMrid} creation.`);
            }
        });


        it('should return Error CreateEnergyAccount HTA - Hour Change Spring Less 1H too much points', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            transactionContext.stub.getState.withArgs(Values.HTA_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_systemoperator)));
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collections: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateData.withArgs(collections[0], Values.HTA_site_valid.meteringPointMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_site_valid)));

            var nrjObj: EnergyAccount = JSON.parse(JSON.stringify(Values.HTA_EnergyAccount_a3));
            const lapTimePlus1HDays: string[] = params.values.get(ParametersType.ENERGY_ACCOUNT_TIME_INTERVAL_LAPsec_PLUS1H_DAYS);
            nrjObj.startCreatedDateTime = lapTimePlus1HDays[0];

            nrjObj.timeSeries.push({"position":1,"inQuantity":3822});
            nrjObj.timeSeries.push({"position":1,"inQuantity":3822});
            nrjObj.timeSeries.push({"position":1,"inQuantity":3822});
            nrjObj.timeSeries.push({"position":1,"inQuantity":3822});
            nrjObj.timeSeries.push({"position":1,"inQuantity":3822});
            nrjObj.timeSeries.push({"position":1,"inQuantity":3822});
            nrjObj.timeSeries.push({"position":1,"inQuantity":3822});

            try {
                await star.CreateEnergyAccount(transactionContext, JSON.stringify(nrjObj));
            } catch (err) {
                expect(err.message).to.equal(`ERROR createEnergyAccount : timeSeries[${nrjObj.timeSeries.length}] does not respect the expected number of points 150 for Energy Account ${nrjObj.energyAccountMarketDocumentMrid} creation.`);
            }
        });



        it('should return SUCCESS CreateEnergyAccount HTA - Hour Change Spring Less 1H', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            transactionContext.stub.getState.withArgs(Values.HTA_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_systemoperator)));
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collections: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateData.withArgs(collections[0], Values.HTA_site_valid.meteringPointMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_site_valid)));

            var nrjObj: EnergyAccount = JSON.parse(JSON.stringify(Values.HTA_EnergyAccount_a3));
            const lapTimePlus1HDays: string[] = params.values.get(ParametersType.ENERGY_ACCOUNT_TIME_INTERVAL_LAPsec_PLUS1H_DAYS);
            nrjObj.startCreatedDateTime = lapTimePlus1HDays[0];

            nrjObj.timeSeries.push({"position":1,"inQuantity":3822});
            nrjObj.timeSeries.push({"position":1,"inQuantity":3822});
            nrjObj.timeSeries.push({"position":1,"inQuantity":3822});
            nrjObj.timeSeries.push({"position":1,"inQuantity":3822});
            nrjObj.timeSeries.push({"position":1,"inQuantity":3822});
            nrjObj.timeSeries.push({"position":1,"inQuantity":3822});
            await star.CreateEnergyAccount(transactionContext, JSON.stringify(nrjObj));

            const expected = JSON.parse(JSON.stringify(nrjObj))
            expected.docType = DocType.ENERGY_ACCOUNT;
            transactionContext.stub.putPrivateData.should.have.been.calledWithExactly(
                collections[0],
                nrjObj.energyAccountMarketDocumentMrid,
                Buffer.from(JSON.stringify(expected))
            );

            expect(transactionContext.stub.putPrivateData.callCount).to.equal(1);
        });




        it('should return SUCCESS CreateEnergyAccountList 2 HTA', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            transactionContext.stub.getState.withArgs(Values.HTA_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_systemoperator)));
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collections: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateData.withArgs(collections[0], Values.HTA_site_valid.meteringPointMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_site_valid)));

            const list_EnergyAccount = [Values.HTA_EnergyAccount_a3, Values.HTA_EnergyAccount_a4];
            await star.CreateEnergyAccountList(transactionContext, JSON.stringify(list_EnergyAccount));

            const expected = JSON.parse(JSON.stringify(Values.HTA_EnergyAccount_a3));
            expected.docType = DocType.ENERGY_ACCOUNT;
            const expected2 = JSON.parse(JSON.stringify(Values.HTA_EnergyAccount_a4));
            expected2.docType = DocType.ENERGY_ACCOUNT;

            // params.logger.info("-----------")
            // params.logger.info(transactionContext.stub.putPrivateData.firstCall.args);
            // params.logger.info("ooooooooo")
            // params.logger.info(Buffer.from(transactionContext.stub.putPrivateData.firstCall.args[2].toString()).toString('utf8'));
            // params.logger.info(JSON.stringify(expected))
            // params.logger.info("-----------")
            // params.logger.info(transactionContext.stub.putPrivateData.secondCall.args);
            // params.logger.info("ooooooooo")
            // params.logger.info(Buffer.from(transactionContext.stub.putPrivateData.secondCall.args[2].toString()).toString('utf8'));
            // params.logger.info(JSON.stringify(expected2))
            // params.logger.info("-----------")

            transactionContext.stub.putPrivateData.firstCall.should.have.been.calledWithExactly(
                collections[0],
                Values.HTA_EnergyAccount_a3.energyAccountMarketDocumentMrid,
                Buffer.from(JSON.stringify(expected))
            );

            transactionContext.stub.putPrivateData.secondCall.should.have.been.calledWithExactly(
                collections[0],
                Values.HTA_EnergyAccount_a4.energyAccountMarketDocumentMrid,
                Buffer.from(JSON.stringify(expected2))
            );

            expect(transactionContext.stub.putPrivateData.callCount).to.equal(2);
        });

        it('should return ERROR CreateEnergyAccount HTA missing System Operator', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            const energyaccount:EnergyAccount = JSON.parse(JSON.stringify(Values.HTA_EnergyAccount_a3));
            transactionContext.stub.getState.withArgs(Values.HTA_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_systemoperator)));
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collectionNames: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateData.withArgs(collectionNames[0], Values.HTA_site_valid.meteringPointMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_site_valid)));

            const energyaccount_str = JSON.stringify(energyaccount);
            try {
                await star.CreateEnergyAccount(transactionContext, energyaccount_str);
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('System Operator : 17V000000992746D does not exist for Energy Account ea4cef73-ff6b-400b-8957-d34000eb30a3 creation.');
            }
        });

        it('should return ERROR CreateEnergyAccount HTA wrong sender', async () => {
            transactionContext.stub.getState.withArgs(Values.HTB_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTB_systemoperator)));

            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            const energyaccount:EnergyAccount = JSON.parse(JSON.stringify(Values.HTA_EnergyAccount_a3));
            transactionContext.stub.getState.withArgs(Values.HTA_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_systemoperator)));
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collectionNames: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateData.withArgs(collectionNames[0], energyaccount.meteringPointMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_site_valid)));

            const energyaccount_str = JSON.stringify(energyaccount);
            try {
                await star.CreateEnergyAccount(transactionContext, energyaccount_str);
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('Energy Account, sender: enedis does not have rights for ea4cef73-ff6b-400b-8957-d34000eb30a3 creation. (Wrong SystemOperator)');
            }
        });

        it('should return ERROR CreateEnergyAccount HTA mismatch ', async () => {
            const energyaccount:EnergyAccount = JSON.parse(JSON.stringify(Values.HTA_EnergyAccount_a3));
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);

            transactionContext.stub.getState.withArgs(Values.HTA_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_systemoperator)));
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collectionNames: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateData.withArgs(collectionNames[0], energyaccount.meteringPointMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_site_valid)));

            try {
                await star.CreateEnergyAccount(transactionContext, JSON.stringify(energyaccount));
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('Energy Account, sender: '.concat('17V000000992746D')
                    .concat(' does is not the same as site.systemOperator: ')
                    .concat('17V0000009927454')
                    .concat(' in EnergyAccount creation.'));
            }
        });

        it('should return ERROR CreateEnergyAccount HTA presence of marketEvaluationPointMrid', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            const energyaccount:EnergyAccount = JSON.parse(JSON.stringify(Values.HTA_EnergyAccount_a3));
            transactionContext.stub.getState.withArgs(Values.HTA_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_systemoperator)));
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collectionNames: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateData.withArgs(collectionNames[0], energyaccount.meteringPointMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_site_valid)));

            const energyaccount_str = await Values.deleteJSONField(JSON.stringify(energyaccount), "marketEvaluationPointMrid");
            try {
                await star.CreateEnergyAccount(transactionContext, energyaccount_str);
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('Energy Account, presence of marketEvaluationPointMrid optionnal for HTA but required for HTB in EnergyAccount creation.');
            }
        });
    });


/*
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////    HTB     ////////////////////////////
////////////////////////////////////////////////////////////////////////////
*/

    describe('Test CreateEnergyAccount HTB', () => {
        it('should return ERROR on CreateEnergyAccount NON-JSON Value', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.RTE);
            try {
                await star.CreateEnergyAccount(transactionContext, 'RTE01EIC');
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('ERROR '.concat(DocType.ENERGY_ACCOUNT).concat(' -> Input string NON-JSON value'));
            }
        });

        it('should return ERROR CreateEnergyAccount HTB Site non-JSON value', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.RTE);
            const energyaccount:EnergyAccount = JSON.parse(JSON.stringify(Values.HTB_EnergyAccount_a3));
            transactionContext.stub.getState.withArgs(Values.HTB_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTB_systemoperator)));
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collectionNames: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateData.withArgs(collectionNames[0], energyaccount.meteringPointMrid).resolves(Buffer.from("XXXX"));

            const energyaccount_str = JSON.stringify(energyaccount);
            try {
                await star.CreateEnergyAccount(transactionContext, energyaccount_str);
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('ERROR createEnergyAccount : ERROR '.concat(DocType.SITE).concat(' -> Input string NON-JSON value for Energy Account ea4cef73-ff6b-400b-8957-d34000eb30a3 creation.'));
            }
        });

        it('should return ERROR CreateEnergyAccount HTB Producer non-JSON value', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.RTE);
            const energyaccount:EnergyAccount = JSON.parse(JSON.stringify(Values.HTB_EnergyAccount_a3));
            transactionContext.stub.getState.withArgs(Values.HTB_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from("XXXXX"));
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collectionNames: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateData.withArgs(collectionNames[0], energyaccount.meteringPointMrid).resolves(Buffer.from(JSON.stringify(Values.HTB_site_valid)));

            const energyaccount_str = JSON.stringify(energyaccount);
            try {
                await star.CreateEnergyAccount(transactionContext, energyaccount_str);
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('ERROR createEnergyAccount : ERROR '.concat(DocType.SYSTEM_OPERATOR).concat(' -> Input string NON-JSON value for Energy Account ea4cef73-ff6b-400b-8957-d34000eb30a3 creation.'));
            }
        });

        it('should return ERROR CreateEnergyAccount Wrong MSPID', async () => {

            transactionContext.clientIdentity.getMSPID.returns(Values.FakeMSP);
            try {
                await star.CreateEnergyAccount(transactionContext, JSON.stringify(Values.HTB_EnergyAccount_a3));
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('Organisation, FakeMSP does not have rights for Energy Account.');
            }
        });

        it('should return ERROR CreateEnergyAccount missing Site', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.RTE);
            const energyaccount:EnergyAccount = JSON.parse(JSON.stringify(Values.HTB_EnergyAccount_a3));
            transactionContext.stub.getState.withArgs(Values.HTB_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTB_systemoperator)));

            const energyaccount_str = JSON.stringify(energyaccount);
            try {
                await star.CreateEnergyAccount(transactionContext, energyaccount_str);
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('ERROR createEnergyAccount : '.concat(DocType.SITE).concat(' : ').concat(energyaccount.meteringPointMrid).concat(' does not exist (not found in any collection). for Energy Account ea4cef73-ff6b-400b-8957-d34000eb30a3 creation.'));
            }
        });

        it('should return ERROR CreateEnergyAccount HTB missing System Operator', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.RTE);
            const energyaccount:EnergyAccount = JSON.parse(JSON.stringify(Values.HTB_EnergyAccount_a3));
            transactionContext.stub.getState.withArgs(Values.HTB_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTB_systemoperator)));
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collectionNames: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateData.withArgs(collectionNames[0], energyaccount.meteringPointMrid).resolves(Buffer.from(JSON.stringify(Values.HTB_site_valid)));

            energyaccount.senderMarketParticipantMrid = "17V000000992746666"
            const energyaccount_str = JSON.stringify(energyaccount);
            try {
                await star.CreateEnergyAccount(transactionContext, energyaccount_str);
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('ERROR createEnergyAccount : '.concat(DocType.SYSTEM_OPERATOR).concat(' : 17V000000992746666 does not exist for Energy Account ea4cef73-ff6b-400b-8957-d34000eb30a3 creation.'));
            }
        });

        it('should return ERROR CreateEnergyAccount HTB wrong sender', async () => {
            transactionContext.stub.getState.withArgs(Values.HTA_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_systemoperator)));

            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.RTE);
            const energyaccount:EnergyAccount = JSON.parse(JSON.stringify(Values.HTB_EnergyAccount_a3));
            transactionContext.stub.getState.withArgs(Values.HTB_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTB_systemoperator)));
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collectionNames: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateData.withArgs(collectionNames[0], energyaccount.meteringPointMrid).resolves(Buffer.from(JSON.stringify(Values.HTB_site_valid)));

            const energyaccount_str = JSON.stringify(energyaccount);
            try {
                await star.CreateEnergyAccount(transactionContext, energyaccount_str);
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('Energy Account, sender: rte does not have rights for ea4cef73-ff6b-400b-8957-d34000eb30a3 creation. (Wrong SystemOperator)');
            }
        });

        it('should return ERROR CreateEnergyAccount HTB missing marketEvaluationPointMrid', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.RTE);
            const energyaccount:EnergyAccount = JSON.parse(JSON.stringify(Values.HTB_EnergyAccount_a3));
            transactionContext.stub.getState.withArgs(Values.HTB_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTB_systemoperator)));
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collectionNames: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateData.withArgs(collectionNames[0], energyaccount.meteringPointMrid).resolves(Buffer.from(JSON.stringify(Values.HTB_site_valid)));

            const energyaccount_str = await Values.deleteJSONField(JSON.stringify(energyaccount), "marketEvaluationPointMrid");
            try {
                await star.CreateEnergyAccount(transactionContext, energyaccount_str);
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('Energy Account, missing marketEvaluationPointMrid optionnal for HTA but required for HTB in EnergyAccount.');
            }
        });

        it('should return ERROR CreateEnergyAccount HTB mismatch ', async () => {
            const energyaccount:EnergyAccount = JSON.parse(JSON.stringify(Values.HTB_EnergyAccount_a3));
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.RTE);

            transactionContext.stub.getState.withArgs(Values.HTB_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTB_systemoperator)));
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collectionNames: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateData.withArgs(collectionNames[0], energyaccount.meteringPointMrid).resolves(Buffer.from(JSON.stringify(Values.HTB_site_valid)));


            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.RTE);
            try {
                await star.CreateEnergyAccount(transactionContext, JSON.stringify(energyaccount));
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('Energy Account, sender: '.concat('17V000000992746D')
                    .concat(' is not the same as site.systemOperator: ')
                    .concat('17V0000009927454')
                    .concat(' in EnergyAccount creation.'));
            }
        });

        it('should return SUCCESS CreateEnergyAccount HTB', async () => {
            const energyaccount:EnergyAccount = JSON.parse(JSON.stringify(Values.HTB_EnergyAccount_a3));
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.RTE);

            transactionContext.stub.getState.withArgs(Values.HTB_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTB_systemoperator)));
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collections: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateData.withArgs(collections[0], energyaccount.meteringPointMrid).resolves(Buffer.from(JSON.stringify(Values.HTB_site_valid)));

            await star.CreateEnergyAccount(transactionContext, JSON.stringify(energyaccount));

            const expected = JSON.parse(JSON.stringify(Values.HTB_EnergyAccount_a3))
            expected.docType = DocType.ENERGY_ACCOUNT;
            transactionContext.stub.putPrivateData.should.have.been.calledWithExactly(
                collections[0],
                Values.HTB_EnergyAccount_a3.energyAccountMarketDocumentMrid,
                Buffer.from(JSON.stringify(expected))
            );

            expect(transactionContext.stub.putPrivateData.callCount).to.equal(1);
        });
    });


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////    GET     ////////////////////////////
////////////////////////////////////////////////////////////////////////////
    describe('Test GetEnergyAccountForSystemOperator HTA', () => {
        it('should return ERROR on GetEnergyAccount no systemOperator', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            const producer = 'toto';
            try {
                await star.GetEnergyAccountForSystemOperator(transactionContext, producer, producer, producer);
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('ERROR getEnergyAccountForSystemOperator : '.concat(DocType.SYSTEM_OPERATOR).concat(' : toto does not exist for Energy Account read.'));
            }
        });

        it('should return OK on GetEnergyAccountForSystemOperator HTA empty', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            transactionContext.stub.getState.withArgs(Values.HTA_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_systemoperator)));
            const producer = 'toto';
            let ret = await star.GetEnergyAccountForSystemOperator(transactionContext, producer, Values.HTA_systemoperator.systemOperatorMarketParticipantMrid, "date");
            ret = JSON.parse(ret);
            // params.logger.log('retADproducer=', ret)
            expect(ret.length).to.equal(0);
            expect(ret).to.eql([]);
        });

        it('should return Error on GetEnergyAccountForSystemOperator HTA Wrong MSPID', async () => {
            transactionContext.clientIdentity.getMSPID.returns(Values.FakeMSP);
            try {
                await star.GetEnergyAccountForSystemOperator(transactionContext, 'titi', 'toto', 'tata');
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('Organisation, '.concat(Values.FakeMSP).concat(' does not have read access for Energy Account.'));
            }
        });

        it('should return OK on GetEnergyAccountForSystemOperator HTA 47,71 error coverage', async () => {
            transactionContext.stub.getState.withArgs(Values.HTA_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_systemoperator)));

            const iterator = Values.getQueryMockArrayValues([Values.HTA_EnergyAccount_a1],mockHandler);

            const dateUp = new Date(Values.HTA_EnergyAccount_a1.createdDateTime);
            dateUp.setUTCHours(0,0,0,0);
            const dateDown = new Date(dateUp.getTime() + 86399999);

            const query = `{
                "selector":
                {
                    "docType": "energyAccount",
                    "meteringPointMrid": "${Values.HTA_EnergyAccount_a1.meteringPointMrid}",
                    "senderMarketParticipantMrid": "${Values.HTA_EnergyAccount_a1.senderMarketParticipantMrid}",
                    "createdDateTime": {
                        "$gte": ${JSON.stringify(dateUp)},
                        "$lte": ${JSON.stringify(dateDown)}
                    },
                    "sort": [{
                        "createdDateTime" : "desc"
                    }]
                }
            }`;
            transactionContext.stub.getQueryResult.withArgs(query).resolves(iterator);
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);

            // let ret = await star.GetEnergyAccountForSystemOperator(transactionContext, nrj1.revisionNumber, nrj1.senderMarketParticipantMrid, nrj1.createdDateTime);

            let ret = await star.GetEnergyAccountForSystemOperator(transactionContext,
                Values.HTA_EnergyAccount_a1.revisionNumber as string,
                Values.HTA_EnergyAccount_a1.senderMarketParticipantMrid,
                Values.HTA_EnergyAccount_a1.createdDateTime);
            ret = JSON.parse(ret);
            // params.logger.log('retEmpty=', ret)
            expect(ret.length).to.equal(0);
            expect(ret).to.eql([]);
        });

        it('should return Error on GetEnergyAccountForSystemOperator HTA wrong read rights', async () => {
            transactionContext.stub.getState.withArgs(Values.HTB_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTB_systemoperator)));

            const iterator = Values.getQueryMockArrayValues([Values.HTB_EnergyAccount_a3],mockHandler);

            const dateUp = new Date(Values.HTB_EnergyAccount_a3.createdDateTime);
            dateUp.setUTCHours(0,0,0,0);
            const dateDown = new Date(dateUp.getTime() + 86399999);

            const query = `{
                "selector":
                {
                    "docType": "energyAccount",
                    "meteringPointMrid": "${Values.HTB_EnergyAccount_a3.meteringPointMrid}",
                    "createdDateTime": {
                        "$gte": ${JSON.stringify(dateUp)},
                        "$lte": ${JSON.stringify(dateDown)}
                    },
                    "sort": [{
                        "createdDateTime" : "desc"
                    }]
                }
            }`;
            transactionContext.stub.getQueryResult.withArgs(query).resolves(iterator);
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.RTE);

            try {
                await star.GetEnergyAccountForSystemOperator(transactionContext,
                    Values.HTB_EnergyAccount_a3.meteringPointMrid,
                    Values.HTB_EnergyAccount_a3.senderMarketParticipantMrid,
                    Values.HTB_EnergyAccount_a3.createdDateTime);
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('Energy Account, sender: enedis does not provide his own systemOperatorEicCode therefore he does not have read access.');
            }
        });

        it('should return SUCCESS on GetEnergyAccountForSystemOperator HTA', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
            transactionContext.stub.getState.withArgs(Values.HTA_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTA_systemoperator)));

            const iterator = Values.getQueryMockArrayValues([Values.HTA_EnergyAccount_a1],mockHandler);

            var args: string[] = [];
            args.push(`"meteringPointMrid": "${Values.HTA_EnergyAccount_a1.meteringPointMrid}"`);
            args.push(`"senderMarketParticipantMrid": "${Values.HTA_EnergyAccount_a1.senderMarketParticipantMrid}"`);
            const query = await QueryStateService.buildQuery({documentType: DocType.ENERGY_ACCOUNT, queryArgs: args});

            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collections: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateDataQueryResult.withArgs(collections[0], query).resolves(iterator);

            let ret = await star.GetEnergyAccountForSystemOperator(transactionContext,
                Values.HTA_EnergyAccount_a1.meteringPointMrid,
                Values.HTA_EnergyAccount_a1.senderMarketParticipantMrid,
                Values.HTA_EnergyAccount_a1.createdDateTime);
            ret = JSON.parse(ret);
            // params.logger.log('ret=', ret)
            expect(ret.length).to.equal(1);


            const expected: EnergyAccount[] = [JSON.parse(JSON.stringify(Values.HTA_EnergyAccount_a1))];

            expect(ret).to.eql(expected);
        });

        // it('should return SUCCESS on GetEnergyAccountForSystemOperator HTA for non JSON value', async () => {
        //     transactionContext.stub.putState.onFirstCall().callsFake((key, value) => {
        //         transactionContext.stub.states = {};
        //         transactionContext.stub.states[key] = 'non-json-value';
        //     });

        //     const site: Site = {meteringPointMrid: 'PRM50012536123456',systemOperatorMarketParticipantMrid: '17V0000009927454',producerMarketParticipantMrid: '17X000001309745X',technologyType: 'Eolien',siteType: 'Injection',siteName: 'Ferme éolienne de Genonville',substationMrid: 'GDO A4RTD',substationName: 'CIVRAY',siteAdminMrid: '489 981 029', siteLocation: 'Biscarosse', siteIecCode: 'S7X0000013077478', systemOperatorEntityFlexibilityDomainMrid: 'PSC4511', systemOperatorEntityFlexibilityDomainName: 'Départ 1', systemOperatorCustomerServiceName: 'DR Nantes Deux-Sèvres'};

        //     transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
        //     await star.CreateSystemOperator(transactionContext, '{\"systemOperatorMarketParticipantMrid\": \"bullshit\",\"systemOperatorMarketParticipantName\": \"Enedis\",\"systemOperatorMarketParticipantRoleType\": \"A50\"}');
        //     await star.CreateSystemOperator(transactionContext, '{\"systemOperatorMarketParticipantMrid\": \"17V0000009927454\",\"systemOperatorMarketParticipantName\": \"Enedis\",\"systemOperatorMarketParticipantRoleType\": \"A50\"}');
        //     await star.CreateProducer(transactionContext, '{\"producerMarketParticipantMrid\": \"17X000001309745X\",\"producerMarketParticipantName\": \"EolienFR vert Cie\",\"producerMarketParticipantRoleType\": \"A21\"}');
        //     await star.CreateSite(transactionContext, JSON.stringify(site));

        //     // const date = new Date(1634898550000);
        //     const nrj1 : EnergyAccount = {
        //         energyAccountMarketDocumentMrid: "ea4cef73-ff6b-400b-8957-d34000eb30a1",
        //         meteringPointMrid: "PRM50012536123456",
        //         // marketEvaluationPointMrid: "CodePPE",
        //         areaDomain: "17X100A100A0001A",
        //         senderMarketParticipantMrid: "17V0000009927454",
        //         senderMarketParticipantRole: "A50",
        //         receiverMarketParticipantMrid: "Producteur1",
        //         receiverMarketParticipantRole: "A32",
        //         createdDateTime: "2021-10-21T10:29:10.000Z",
        //         measurementUnitName: "KW",
        //         timeInterval: "2021-10-21T10:29:10.000Z",
        //         resolution: "PT10M",
        //         timeSeries: [{inQuantity: 7500, position: 3},{inQuantity: 7500, position: 3}],
        //         revisionNumber: "1",
        //         businessType: "A14 / Z14",
        //         docStatus: "A02",
        //         processType: "A05",
        //         classificationType: "A02",
        //         product: "Energie active/Réactive",
        //     };

        //     await star.CreateEnergyAccount(transactionContext, JSON.stringify(nrj1));
        //     let ret1 = JSON.parse((await transactionContext.stub.getState(nrj1.energyAccountMarketDocumentMrid)).toString());
        //     // params.logger.log("ret1=", ret1);
        //     expect(ret1).to.eql( Object.assign({docType: 'energyAccount'}, nrj1 ));

        //     const nrj2 : EnergyAccount = {
        //         energyAccountMarketDocumentMrid: "ea4cef73-ff6b-400b-8957-d34000eb30a2",
        //         meteringPointMrid: "PRM50012536123456",
        //         // marketEvaluationPointMrid: "CodePPE",
        //         areaDomain: "17X100A100A0001A",
        //         senderMarketParticipantMrid: "17V0000009927454",
        //         senderMarketParticipantRole: "A50",
        //         receiverMarketParticipantMrid: "Producteur1",
        //         receiverMarketParticipantRole: "A32",
        //         createdDateTime: "2021-10-22T10:29:10.000Z",
        //         measurementUnitName: "KW",
        //         timeInterval: "2021-10-22T10:29:10.000Z",
        //         resolution: "PT10M",
        //         timeSeries: [{inQuantity: 7500, position: 3},{inQuantity: 7500, position: 3}],
        //         revisionNumber: "1",
        //         businessType: "A14 / Z14",
        //         docStatus: "A02",
        //         processType: "A05",
        //         classificationType: "A02",
        //         product: "Energie active/Réactive",
        //     };

        //     await star.CreateEnergyAccount(transactionContext, JSON.stringify(nrj2));
        //     let ret2 = JSON.parse((await transactionContext.stub.getState(nrj2.energyAccountMarketDocumentMrid)).toString());
        //     // params.logger.log("ret2=", ret2);
        //     expect(ret2).to.eql( Object.assign({docType: 'energyAccount'}, nrj2 ));

        //     let ret = await star.GetEnergyAccountForSystemOperator(transactionContext, nrj1.meteringPointMrid, nrj1.senderMarketParticipantMrid, nrj1.createdDateTime);
        //     ret = JSON.parse(ret);
        // //     // params.logger.log('ret=', ret)
        //     expect(ret.length).to.equal(2);

        //     const expected = [
        //         "non-json-value",
        //         {
        //             docType: "energyAccount",
        //             energyAccountMarketDocumentMrid: "ea4cef73-ff6b-400b-8957-d34000eb30a1",
        //             meteringPointMrid: "PRM50012536123456",
        //             // marketEvaluationPointMrid: "CodePPE",
        //             areaDomain: "17X100A100A0001A",
        //             senderMarketParticipantMrid: "17V0000009927454",
        //             senderMarketParticipantRole: "A50",
        //             receiverMarketParticipantMrid: "Producteur1",
        //             receiverMarketParticipantRole: "A32",
        //             createdDateTime: "2021-10-21T10:29:10.000Z",
        //             measurementUnitName: "KW",
        //             timeInterval: "2021-10-21T10:29:10.000Z",
        //             resolution: "PT10M",
        //             timeSeries: [{inQuantity: 7500, position: 3},{inQuantity: 7500, position: 3}],
        //             revisionNumber: "1",
        //             businessType: "A14 / Z14",
        //             docStatus: "A02",
        //             processType: "A05",
        //             classificationType: "A02",
        //             product: "Energie active/Réactive",
        //         }
        //    ];

        //     expect(ret).to.eql(expected);
        // });
    });

    describe('Test GetEnergyAccountForSystemOperator HTB', () => {
        it('should return ERROR on GetEnergyAccountForSystemOperator HTB', async () => {
            transactionContext.stub.getState.withArgs(Values.HTB_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from("XXX"));

            const iterator = Values.getQueryMockArrayValues([Values.HTB_EnergyAccount_a3,Values.HTB_EnergyAccount_a4],mockHandler);

            const dateUp = new Date(Values.HTB_EnergyAccount_a3.createdDateTime);
            dateUp.setUTCHours(0,0,0,0);
            const dateDown = new Date(dateUp.getTime() + 86399999);

            var args: string[] = [];
            args.push(`"meteringPointMrid": "${Values.HTB_EnergyAccount_a3.meteringPointMrid}"`);
            args.push(`"createdDateTime":{"$gte":${JSON.stringify(dateUp)},"$lte": ${JSON.stringify(dateDown)}}`);

            const query = await QueryStateService.buildQuery({documentType: DocType.ENERGY_ACCOUNT, queryArgs: args});

            // params.logger.info("query : ", query);


            // const query = `{
            //     "selector":
            //     {
            //         "docType": "energyAccount",
            //         "meteringPointMrid": "${Values.HTB_EnergyAccount_a3.meteringPointMrid}",
            //         "createdDateTime": {
            //             "$gte": ${JSON.stringify(dateUp)},
            //             "$lte": ${JSON.stringify(dateDown)}
            //         },
            //         "sort": [{
            //             "createdDateTime" : "desc"
            //         }]
            //     }
            // }`;
            transactionContext.stub.getQueryResult.withArgs(query).resolves(iterator);
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.RTE);

            try {
                await star.GetEnergyAccountForSystemOperator(transactionContext,
                    Values.HTB_EnergyAccount_a3.meteringPointMrid,
                    Values.HTB_EnergyAccount_a3.senderMarketParticipantMrid,
                    Values.HTB_EnergyAccount_a3.createdDateTime);
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal('ERROR getEnergyAccountForSystemOperator : ERROR '.concat(DocType.SYSTEM_OPERATOR).concat(' -> Input string NON-JSON value for Energy Account read.'));
            }
        });

        it('should return SUCCESS on GetEnergyAccountForSystemOperator HTB', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.RTE);
            transactionContext.stub.getState.withArgs(Values.HTB_systemoperator.systemOperatorMarketParticipantMrid).resolves(Buffer.from(JSON.stringify(Values.HTB_systemoperator)));

            const iterator = Values.getQueryMockArrayValues([Values.HTB_EnergyAccount_a3,Values.HTB_EnergyAccount_a4],mockHandler);

            var args: string[] = [];
            args.push(`"meteringPointMrid": "${Values.HTB_EnergyAccount_a3.meteringPointMrid}"`);

            const query = await QueryStateService.buildQuery({documentType: DocType.ENERGY_ACCOUNT, queryArgs: args});

            // const query = `{
            //     "selector":
            //     {
            //         "docType": "energyAccount",
            //         "meteringPointMrid": "${Values.HTB_EnergyAccount_a3.meteringPointMrid}",
            //         "createdDateTime": {
            //             "$gte": ${JSON.stringify(dateUp)},
            //             "$lte": ${JSON.stringify(dateDown)}
            //         },
            //         "sort": [{
            //             "createdDateTime" : "desc"
            //         }]
            //     }
            // }`;
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collections: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);
            transactionContext.stub.getPrivateDataQueryResult.withArgs(collections[0], query).resolves(iterator);

            let ret = await star.GetEnergyAccountForSystemOperator(transactionContext,
                Values.HTB_EnergyAccount_a3.meteringPointMrid,
                Values.HTB_EnergyAccount_a3.senderMarketParticipantMrid,
                Values.HTB_EnergyAccount_a3.createdDateTime);
            ret = JSON.parse(ret);
            // params.logger.log('ret=', ret)
            expect(ret.length).to.equal(2);

            const expected: EnergyAccount[] = [JSON.parse(JSON.stringify(Values.HTB_EnergyAccount_a3)),JSON.parse(JSON.stringify(Values.HTB_EnergyAccount_a4))];

            expect(ret).to.eql(expected);
        });
    });

    describe('Test GetEnergyAccountByProducer', () => {
        it('should return Error on GetEnergyAccountByProducer Wrong MSPID', async () => {
            try {
                await star.GetEnergyAccountByProducer(transactionContext, 'titi', 'toto', 'tata');
            } catch(err) {
                // params.logger.info(err.message)
                expect(err.message).to.equal(`Organisation, ${Values.FakeMSP} does not have read access for producer\'s Energy Account.`);
            }
        });

        it('should return OK on GetEnergyAccountByProducer empty', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.PRODUCER);
            const producer = 'toto';
            let ret = await star.GetEnergyAccountByProducer(transactionContext, producer, '17V0000009927454', "date");
            ret = JSON.parse(ret);
            // params.logger.log('retADproducer=', ret)
            expect(ret.length).to.equal(0);
            expect(ret).to.eql([]);
        });

        it('should return SUCCESS on GetEnergyAccountByProducer', async () => {
            transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.PRODUCER);
            const params: STARParameters = await ParametersController.getParameterValues(transactionContext);
            const collections: string[] = await HLFServices.getCollectionsOrDefault(params, ParametersType.DATA_TARGET);

            const dateStart = new Date(Values.HTA_EnergyAccount_a1.startCreatedDateTime);

            var args: string[] = [];
            args.push(`"meteringPointMrid":"${Values.HTA_EnergyAccount_a1.meteringPointMrid}"`);
            args.push(`"receiverMarketParticipantMrid":"${Values.HTA_EnergyAccount_a1.receiverMarketParticipantMrid}"`);
            args.push(`"startCreatedDateTime":{"$lte":${JSON.stringify(dateStart)}}`);

            var argOrEnd: string[] = [];
            argOrEnd.push(`"endCreatedDateTime":{"$gte": ${JSON.stringify(dateStart)}}`);
            argOrEnd.push(`"endCreatedDateTime":""`);
            argOrEnd.push(`"endCreatedDateTime":{"$exists": false}`);
            args.push(await QueryStateService.buildORCriteria(argOrEnd));

            const query = await QueryStateService.buildQuery({documentType: DocType.ENERGY_ACCOUNT, queryArgs: args});
            // params.logger.log('query=', query)

            const iterator = Values.getQueryMockArrayValues([Values.HTA_EnergyAccount_a1],mockHandler);

            // params.logger.log('collections[0]=', collections[0])
            transactionContext.stub.getPrivateDataQueryResult.withArgs(collections[0], query).resolves(iterator);

            let ret = await star.GetEnergyAccountByProducer(transactionContext,
                Values.HTA_EnergyAccount_a1.meteringPointMrid,
                Values.HTA_EnergyAccount_a1.receiverMarketParticipantMrid,
                Values.HTA_EnergyAccount_a1.startCreatedDateTime);
            ret = JSON.parse(ret);
            // params.logger.log('ret=', ret)
            expect(ret.length).to.equal(1);

            const expected: EnergyAccount[] = [JSON.parse(JSON.stringify(Values.HTA_EnergyAccount_a1))];

            expect(ret).to.eql(expected);
        });

        // it('should return SUCCESS on getEnergyAccountByProducer for non JSON value', async () => {
        //     transactionContext.stub.putState.onFirstCall().callsFake((key, value) => {
        //         transactionContext.stub.states = {};
        //         transactionContext.stub.states[key] = 'non-json-value';
        //     });

        //     transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.ENEDIS);
        //     await star.CreateSystemOperator(transactionContext, '{\"systemOperatorMarketParticipantMrid\": \"4\",\"systemOperatorMarketParticipantName\": \"Enedis\",\"systemOperatorMarketParticipantRoleType\": \"A50\"}');
        //     await star.CreateSystemOperator(transactionContext, '{\"systemOperatorMarketParticipantMrid\": \"17V0000009927454\",\"systemOperatorMarketParticipantName\": \"Enedis\",\"systemOperatorMarketParticipantRoleType\": \"A50\"}');
        //     await star.CreateProducer(transactionContext, '{\"producerMarketParticipantMrid\": \"17X000001309745X\",\"producerMarketParticipantName\": \"EolienFR vert Cie\",\"producerMarketParticipantRoleType\": \"A21\"}');
        //     const site: Site = {meteringPointMrid: 'PRM50012536123456',systemOperatorMarketParticipantMrid: '17V0000009927454',producerMarketParticipantMrid: '17X000001309745X',technologyType: 'Eolien',siteType: 'Injection',siteName: 'Ferme éolienne de Genonville',substationMrid: 'GDO A4RTD',substationName: 'CIVRAY',siteAdminMrid: '489 981 029', siteLocation: 'Biscarosse', siteIecCode: 'S7X0000013077478', systemOperatorEntityFlexibilityDomainMrid: 'PSC4511', systemOperatorEntityFlexibilityDomainName: 'Départ 1', systemOperatorCustomerServiceName: 'DR Nantes Deux-Sèvres'};
        //     await star.CreateSite(transactionContext, JSON.stringify(site));

        //     // const date = new Date(1634898550000);
        //     const nrj1 : EnergyAccount = {
        //         energyAccountMarketDocumentMrid: "ea4cef73-ff6b-400b-8957-d34000eb30a1",
        //         meteringPointMrid: "PRM50012536123456",
        //         // marketEvaluationPointMrid: "CodePPE",
        //         areaDomain: "17X100A100A0001A",
        //         senderMarketParticipantMrid: "17V0000009927454",
        //         senderMarketParticipantRole: "A50",
        //         receiverMarketParticipantMrid: "Producteur1",
        //         receiverMarketParticipantRole: "A32",
        //         createdDateTime: "2021-10-21T10:29:10.000Z",
        //         measurementUnitName: "KW",
        //         timeInterval: "2021-10-21T10:29:10.000Z",
        //         resolution: "PT10M",
        //         timeSeries: [{inQuantity: 7500, position: 3},{inQuantity: 7500, position: 3}],
        //         revisionNumber: "1",
        //         businessType: "A14 / Z14",
        //         docStatus: "A02",
        //         processType: "A05",
        //         classificationType: "A02",
        //         product: "Energie active/Réactive",
        //     };

        //     await star.CreateEnergyAccount(transactionContext, JSON.stringify(nrj1));
        //     let ret1 = JSON.parse((await transactionContext.stub.getState(nrj1.energyAccountMarketDocumentMrid)).toString());
        //     // params.logger.log("ret1=", ret1);
        //     expect(ret1).to.eql( Object.assign({docType: 'energyAccount'}, nrj1 ));

        //     const nrj2 : EnergyAccount = {
        //         energyAccountMarketDocumentMrid: "ea4cef73-ff6b-400b-8957-d34000eb30a2",
        //         meteringPointMrid: "PRM50012536123456",
        //         // marketEvaluationPointMrid: "CodePPE",
        //         areaDomain: "17X100A100A0001A",
        //         senderMarketParticipantMrid: "17V0000009927454",
        //         senderMarketParticipantRole: "A50",
        //         receiverMarketParticipantMrid: "Producteur2",
        //         receiverMarketParticipantRole: "A32",
        //         createdDateTime: "2021-10-22T10:29:10.000Z",
        //         measurementUnitName: "KW",
        //         timeInterval: "2021-10-22T10:29:10.000Z",
        //         resolution: "PT10M",
        //         timeSeries: [{inQuantity: 7500, position: 3},{inQuantity: 7500, position: 3}],
        //         revisionNumber: "1",
        //         businessType: "A14 / Z14",
        //         docStatus: "A02",
        //         processType: "A05",
        //         classificationType: "A02",
        //         product: "Energie active/Réactive",
        //     };

        //     await star.CreateEnergyAccount(transactionContext, JSON.stringify(nrj2));
        //     let ret2 = JSON.parse((await transactionContext.stub.getState(nrj2.energyAccountMarketDocumentMrid)).toString());
        //     // params.logger.log("ret2=", ret2);
        //     expect(ret2).to.eql( Object.assign({docType: 'energyAccount'}, nrj2 ));

        //     transactionContext.clientIdentity.getMSPID.returns(OrganizationTypeMsp.PRODUCER);
        //     let ret = await star.GetEnergyAccountByProducer(transactionContext, nrj1.meteringPointMrid, nrj1.receiverMarketParticipantMrid, nrj1.createdDateTime);
        //     ret = JSON.parse(ret);
        //     // params.logger.log('ret=', ret)
        //     expect(ret.length).to.equal(2);

        //     const expected = [
        //         'non-json-value',
        //         {
        //             docType: "energyAccount",
        //             energyAccountMarketDocumentMrid: "ea4cef73-ff6b-400b-8957-d34000eb30a1",
        //             meteringPointMrid: "PRM50012536123456",
        //             // marketEvaluationPointMrid: "CodePPE",
        //             areaDomain: "17X100A100A0001A",
        //             senderMarketParticipantMrid: "17V0000009927454",
        //             senderMarketParticipantRole: "A50",
        //             receiverMarketParticipantMrid: "Producteur1",
        //             receiverMarketParticipantRole: "A32",
        //             createdDateTime: "2021-10-21T10:29:10.000Z",
        //             measurementUnitName: "KW",
        //             timeInterval: "2021-10-21T10:29:10.000Z",
        //             resolution: "PT10M",
        //             timeSeries: [{inQuantity: 7500, position: 3},{inQuantity: 7500, position: 3}],
        //             revisionNumber: "1",
        //             businessType: "A14 / Z14",
        //             docStatus: "A02",
        //             processType: "A05",
        //             classificationType: "A02",
        //             product: "Energie active/Réactive",
        //         }
        //    ];
        //     expect(ret).to.eql(expected);
        // });
    });
});
