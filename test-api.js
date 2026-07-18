const test = async () => {
  try {
    // 1. Register a new user
    console.log("Registering new user...");
    const regRes = await fetch('http://localhost:8080/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: "Test User",
        email: `test${Date.now()}@test.com`,
        password: "password",
        role: "USER"
      })
    });
    
    const user = await regRes.json();
    console.log("Registered user:", user);
    
    if (!user.id) {
      console.error("User registration failed. Status:", regRes.status, user);
      return;
    }

    // 2. Create property
    console.log(`Creating property for ownerId: ${user.id}...`);
    const propRes = await fetch('http://localhost:8080/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "Test Property",
        propertyType: "Mənzil",
        address: "Test address",
        city: "Test city",
        description: "Test description",
        ownerId: user.id
      })
    });

    const propText = await propRes.text();
    console.log("Create Property Status:", propRes.status);
    console.log("Create Property Body:", propText);
  } catch (err) {
    console.error(err);
  }
};

test();
