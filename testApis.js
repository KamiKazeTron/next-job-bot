import axios from "axios";

async function testApis() {
  try {
    // Test register
    let res = await axios.post("http://localhost:3000/api/auth/register", {
      name: "Jane",
      email: "jane@example.com",
      password: "123456",
      age: 28,
      sex: "female",
      address: "456 Street",
      phone: "9876543210",
    });
    console.log("Register:", res.data);

    // Test login
    res = await axios.post("http://localhost:3000/api/auth/login", {
      email: "jane@example.com",
      password: "123456",
    });
    console.log("Login:", res.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

testApis();
