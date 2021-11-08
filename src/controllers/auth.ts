import { Request, Response } from "express";

const user = {
  name: "Simeon",
  lastName: "Aldana",
  email: "simeon.aldana@altoros.com",
  firmId: "littleNewt",
  password: "12345678",
  rol: "User",
};

const defaultFirm = {
  name: "LittleNewt",
  address: "3947 Duffy Street",
  efin: "415248",
  ein: "45-1458762",
  city: "Crown Point",
  state: "Indiana",
  zip: "46307",
  plan: "LIttleNewt Standard Templates",
  bill: {
    name: "PETER PARKER",
    card: "1234-****-****-3456",
  },
  primaryUser: {
    name: "Peter",
    lastName: "Parker",
    firmId: "LittleNewt",
    email: "spiderman@gmail.com",
    password: "12345678",
    rol: "Admin",
  },
};

export const login = async (req: Request, res: Response) => {
  try {
    const { body } = req;
    console.log(body, "bb");
    if (body.user === "simeon.aldana@altoros.com" && body.pwd === "12345678") {
      res.send({ status: 200, user, firm: defaultFirm });
    }else{
      res.send({ status: 400});
    }
  } catch (err) {
    console.log(err, "err");
    res.status(400).send("Sorry, something went wrong 2");
  }
};
