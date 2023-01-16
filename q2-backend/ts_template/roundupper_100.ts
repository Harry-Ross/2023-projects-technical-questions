import express from "express";

// location is the simple (x, y) coordinates of an entity within the system
// spaceCowboy models a cowboy in our super amazing system
// spaceAnimal models a single animal in our amazing system
type location = { x: number; y: number };
type spaceCowboy = { name: string; lassoLength: number };
type spaceAnimal = { type: "pig" | "cow" | "flying_burger" };

// spaceEntity models an entity in the super amazing (ROUND UPPER 100) system
type spaceEntity =
  | { type: "space_cowboy"; metadata: spaceCowboy; location: location }
  | { type: "space_animal"; metadata: spaceAnimal; location: location };

// === ADD YOUR CODE BELOW :D ===

type spaceAnimalReturn = {type: string, location: location};

// === ExpressJS setup + Server setup ===
const spaceDatabase = [] as spaceEntity[];
const app = express();

app.use(express.json());

// the POST /entity endpoint adds an entity to your global space database
app.post("/entity", (req, res, next) => {
  try {
    if (req.body.entities.length > 0) {
      req.body.entities.map((entity:spaceEntity) => {
        spaceDatabase.push(entity);
      });
      res.status(200).send("done");
    } else {
      res.status(500);
    }
  } catch (err:any) {
    next(err);
  }  
});

// /lassoable returns all the space animals a space cowboy can lasso given their name
app.get("/lassoable", (req, res, next) => {
  const cowboy_name = req.query.cowboy_name;

  

  try {
    const cowboy:any = spaceDatabase.find(entity => 
      entity.type === "space_cowboy" && entity.metadata.name === cowboy_name);
  
    let animals:spaceAnimalReturn[] = [];

    spaceDatabase.forEach(entity => {
      if (entity.type === "space_animal") {
        let diffx = entity.location.x - cowboy.location.x;
        let diffy = entity.location.y - cowboy.location.y;
        let dist = Math.sqrt(Math.pow(diffx, 2) + Math.pow(diffy, 2));
        if (dist <= cowboy.metadata.lassoLength) {
          let newObj:spaceAnimalReturn = { type: entity.metadata.type, location: entity.location};
          animals.push(newObj);  
        }
      }
    })
    res.status(200).send({ space_animals: animals});
  } catch (err:any) {
    next(err);
  }
});

app.listen(8080);