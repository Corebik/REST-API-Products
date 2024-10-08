import { connectDB } from "../server.ts";
import db from "../config/db.ts";

//*  MOCKS  *//

jest.mock("../config/db.ts");

describe("ConnectDB", () => {
   it("Should handle database connection error", async() => {

      jest.spyOn(db, "authenticate")
         .mockRejectedValue(new Error("Error al conectar a la base de datos"));
      const consoleSpy = jest.spyOn(console, "log");

      await connectDB();

      expect(consoleSpy).toHaveBeenCalledWith(
         expect.stringContaining("Error al conectar a la base de datos")
      );

   })
});

