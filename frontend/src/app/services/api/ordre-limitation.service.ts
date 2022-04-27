import { environment } from 'src/environments/environment';
import {
  FormulaireOrdreDebutEtFinLimitationFichier,
  FormulaireOrdreDebutLimitationFichier,
  FormulaireOrdreFinLimitation,
  FormulaireOrdreFinLimitationFichier,
} from 'src/app/models/OrdreLimitation';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdreLimitationService {
  constructor(private httpClient: HttpClient) {}

  creerOrdreDebutAvecFichiers(
    formulaireOrdreDebutLimitationFichier: FormulaireOrdreDebutLimitationFichier
  ): Observable<void> {
    let formData = new FormData();
    this.appendFiles(formData, formulaireOrdreDebutLimitationFichier.files);

    return this.httpClient.post<void>(
      `${environment.serverUrl}/ordreLimitations/debut`,
      formData
    );
  }

  creerOrdreFinAvecFichiers(
    formulaireOrdreFinLimitationFichier: FormulaireOrdreFinLimitationFichier
  ): Observable<void> {
    let formData = new FormData();
    this.appendFiles(formData, formulaireOrdreFinLimitationFichier.files);

    return this.httpClient.post<void>(
      `${environment.serverUrl}/ordreLimitations/fin`,
      formData
    );
  }

  creerOrdreDebutFinAvecFichiers(
    formulaireOrdreDebutEtFinLimitationFichier: FormulaireOrdreDebutEtFinLimitationFichier
  ): Observable<void> {
    let formData = new FormData();
    this.appendFiles(
      formData,
      formulaireOrdreDebutEtFinLimitationFichier.files
    );

    return this.httpClient.post<void>(
      `${environment.serverUrl}/ordreLimitations/couple`,
      formData
    );
  }

  creerOrdreFin(form: FormulaireOrdreFinLimitation): Observable<void> {
    return this.httpClient.post<void>(
      `${environment.serverUrl}/ordreLimitations/fin`,
      form
    );
  }

  private appendFiles(formData: FormData, files: File[]) {
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name);
    }
  }
}