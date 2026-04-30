// seed.js
// =============================================================================
//  Seed the database with realistic test data.
//  Run with: npm run seed
//
//  Required minimum:
//    - 2 users
//    - 4 projects (split across the users)
//    - 5 tasks (with embedded subtasks and tags arrays)
//    - 5 notes (some attached to projects, some standalone)
//
//  Use the bcrypt module to hash passwords before inserting users.
//  Use ObjectId references for relationships (projectId, ownerId).
// =============================================================================

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connect } = require('./db/connection');

(async () => {
  const db = await connect();

  // OPTIONAL: clear existing data so re-seeding is idempotent
  await db.collection('users').deleteMany({});
  await db.collection('projects').deleteMany({});
  await db.collection('tasks').deleteMany({});
  await db.collection('notes').deleteMany({});

  // =============================================================================
  //  TODO: Insert your seed data below.
  //
  //  Hints:
  //    - Hash passwords:   const hash = await bcrypt.hash('password123', 10);
  //    - Capture inserted ids:
  //        const u = await db.collection('users').insertOne({ ... });
  //        const userId = u.insertedId;
  //    - Use those ids when inserting projects/tasks/notes.
  //    - Demonstrate schema flexibility: include at least one optional field
  //      on SOME documents but not all (e.g. dueDate on some tasks only).
  //
  //  Sample task shape:
  //    {
  //      ownerId: <ObjectId>,
  //      projectId: <ObjectId>,
  //      title: "Write report introduction",
  //      status: "todo",
  //      priority: 3,
  //      tags: ["writing", "urgent"],
  //      subtasks: [
  //        { title: "Outline sections", done: true },
  //        { title: "Draft", done: false }
  //      ],
  //      createdAt: new Date()
  //    }
  // =============================================================================
        const hash1 = await bcrypt.hash('alex123', 10);
    const hash2 = await bcrypt.hash('maria456', 10);
    const hash3 = await bcrypt.hash('sam789', 10);

    const us1 = await db.collection('users').insertOne({
      email: "alex.chen@startup.com",
      passwordHash: hash1,
      name: "Alex Chen",
      createdAt: new Date()
    });
    
    const us2 = await db.collection('users').insertOne({
      email: "maria.rodriguez@startup.com",
      passwordHash: hash2,
      name: "Maria Rodriguez",
      createdAt: new Date()
    });
    
    const us3 = await db.collection('users').insertOne({
      email: "sam.taylor@startup.com",
      passwordHash: hash3,
      name: "Sam Taylor",
      createdAt: new Date()
    });
    
    const u1Id = us1.insertedId;
    const u2Id = us2.insertedId;
    const u3Id = us3.insertedId;
    
  const projects = await db.collection('projects').insertMany([
      {
        ownerId: u1Id,
        name: "EcoMobile App",
        description: "Carbon footprint tracking app",
        archived: false,
        createdAt: new Date()
      },
      {
        ownerId: u1Id,
        name: "Investor Pitch Deck",
        description: "Series A funding presentation",
        archived: false,
        createdAt: new Date()
      },
      {
        ownerId: u2Id,
        name: "API Migration",
        description: "Migrate from REST to GraphQL",
        archived: false,
        createdAt: new Date()
      },
      {
        ownerId: u3Id,
        name: "Rebrand",
        description: "Company rebranding project",
        archived: true,
        createdAt: new Date()
      }
    ]);

    const p1 = projects.insertedIds[0];
    const p2 = projects.insertedIds[1];
    const p3 = projects.insertedIds[2];
    const p4 = projects.insertedIds[3];
    
    await db.collection('tasks').insertMany([
      {
        ownerId: u1Id,
        projectId: p1,
        title: "Design onboarding flow",
        status: "in-progress",
        priority: 1,
        tags: ["design", "ux"],
        subtasks: [
          { title: "Sketch wireframes", done: true },
          { title: "Create prototype", done: false }
        ],
        dueDate: new Date("2025-04-10"),
        createdAt: new Date()
      },
      {
        ownerId: u1Id,
        projectId: p1,
        title: "Build carbon calculator",
        status: "todo",
        priority: 1,
        tags: ["backend", "api"],
        subtasks: [
          { title: "Research formulas", done: false },
          { title: "Build engine", done: false }
        ],
        createdAt: new Date()
      },
      {
        ownerId: u1Id,
        projectId: p2,
        title: "Create financial projections",
        status: "in-progress",
        priority: 1,
        tags: ["finance"],
        subtasks: [
          { title: "Gather data", done: true },
          { title: "Build model", done: false }
        ],
        dueDate: new Date("2025-04-05"),
        createdAt: new Date()
      },
      {
        ownerId: u2Id,
        projectId: p3,
        title: "Design GraphQL schema",
        status: "done",
        priority: 2,
        tags: ["graphql"],
        subtasks: [
          { title: "Audit endpoints", done: true },
          { title: "Design types", done: true }
        ],
        createdAt: new Date()
      },
      {
        ownerId: u2Id,
        projectId: p3,
        title: "Write migration script",
        status: "in-progress",
        priority: 2,
        tags: ["nodejs"],
        subtasks: [
          { title: "Parse OpenAPI", done: true },
          { title: "Generate schema", done: false }
        ],
        dueDate: new Date("2025-04-20"),
        createdAt: new Date()
      }
    ]);
    
    await db.collection('notes').insertMany([
      {
        ownerId: u1Id,
        projectId: p1,
        title: "Competitor Research",
        body: "Top competitors: CarbonHero, EcoTrack, GreenSteps",
        tags: ["research"],
        pinned: true,
        createdAt: new Date()
      },
      {
        ownerId: u1Id,
        projectId: p1,
        title: "User Interview Notes",
        body: "User wants simple UI and educational tooltips",
        tags: ["feedback"],
        createdAt: new Date()
      },
      {
        ownerId: u1Id,
        projectId: p2,
        title: "Pitch Deck Outline",
        body: "Problem, Solution, Market, Traction, Team, Ask",
        tags: ["investor"],
        createdAt: new Date()
      },
      {
        ownerId: u2Id,
        projectId: p3,
        title: "GraphQL Resources",
        body: "Apollo docs, HowToGraphQL.com",
        tags: ["learning"],
        createdAt: new Date()
      },
      {
        ownerId: u2Id,
        projectId: null,
        title: "Conference Notes",
        body: "GraphQL Summit key takeaways",
        tags: ["conference"],
        createdAt: new Date()
      }
    ]);
    
  console.log('TODO: implement seed.js');
  process.exit(0);
})();