import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserSettings } from "../models/user-settings";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) { }

    public getUserSettings() {
        return this.http
            .get<UserSettings>("http://localhost:5125/api/UserSettings");
    }

    public updateUserSettings(key: string, value: string) {
        return this.http
            .patch("http://localhost:5125/api/UserSettings/" + key + "/" + value, null);
    }
}