import { Injectable, OnModuleInit } from "@nestjs/common";
import * as admin from "firebase-admin";
import * as serviceAccount from "./firebase-adminsdk.json";

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  onModuleInit() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount
        ),
      });
    }
  }

  async verifyToken(idToken: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (err) {
      console.log(
        "--------------------------------------- error----------------------------"
      );
      console.log(err);
      console.error("Error al verificar el token Firebase:", err);
      throw err;
    }
  }
}
