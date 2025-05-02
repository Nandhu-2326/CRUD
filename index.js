import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQYgcRMb52WzpOAVD8HU9gNUTK5ZNDMvk",
  authDomain: "fd-crud-5ebd0.firebaseapp.com",
  databaseURL: "https://fd-crud-5ebd0-default-rtdb.firebaseio.com",
  projectId: "fd-crud-5ebd0",
  storageBucket: "fd-crud-5ebd0.firebasestorage.app",
  messagingSenderId: "295703733815",
  appId: "1:295703733815:web:2d72c4026bc569d41d81b2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const use = document.querySelector(".btn");
const h1 = document.querySelector(".h1");
const result = document.querySelector(".result");

// Fetch and display all users
const displayUsers = async () => {
  const dataget = await getDocs(collection(db, "users"));
  const users = dataget.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id, // Add the document ID
  }));

  // Clear the result before adding new data
  result.innerHTML = "";

  h1.innerHTML = `Member Count : ${users.length}`;

  users.forEach((user) => {
    result.innerHTML += `
      <tr id="${user.id}" class="table-secondary">
        <td>${user.Name}</td>
        <td>${user.Age}</td>
        <td><button class="edit-btn btn btn-dark btn-sm"> Edit </button></td>
        <td><button class="del-btn btn btn-danger btn-sm"> Delete </button></td>
      </tr>`;
  });

  // Add event listeners for delete buttons
  const deleteButtons = document.querySelectorAll(".del-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const docId = event.target.closest("tr").id; // Get the ID of the row (document)
      await deleteDoc(doc(db, "users", docId)); // Delete the document from Firestore
      displayUsers(); // Refresh the list after deletion
    });
  });
};

// Initial fetch and display of users
displayUsers();

// const editbtn = document.querySelector(".edit-btn");
//   editbtn.addEventListener("click", async (event) => {
//     const docEId = event.target.closest("tr").id;
//     console.log(docEId);
//   });

// Add new user
use.addEventListener("click", async () => {
  const Name = document.querySelector(".input_1");
  const Age = document.querySelector(".input_2");

  // Add new user data to Firestore
  await addDoc(collection(db, "users"), {
    Name: Name.value,
    Age: Age.value,
  });

  // Clear input fields
  Name.value = "";
  Age.value = "";

  // Refresh the user list
  displayUsers();
});
