import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQYgcRMb52WzpOAVD8HU9gNUTK5ZNDMvk",
  authDomain: "fd-crud-5ebd0.firebaseapp.com",
  databaseURL: "https://fd-crud-5ebd0-default-rtdb.firebaseio.com",
  projectId: "fd-crud-5ebd0",
  storageBucket: "fd-crud-5ebd0.appspot.com", // FIXED typo here
  messagingSenderId: "295703733815",
  appId: "1:295703733815:web:2d72c4026bc569d41d81b2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const use = document.querySelector(".sub");
const h1 = document.querySelector(".h1");
const result = document.querySelector(".result");
const updatebtn = document.querySelector(".update");
const Addbtn = document.querySelector(".Addbtn");
const inputName = document.querySelector(".input_1");
const inputAge = document.querySelector(".input_2");

let currentId = null;

// Display users
const displayUsers = async () => {
  const dataget = await getDocs(collection(db, "users"));
  const users = dataget.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  result.innerHTML = "";
  h1.innerHTML = `Member Count - <ion-icon name="people-circle-outline"></ion-icon> - ${users.length}`;

  users.forEach((user) => {
    result.innerHTML += `
      <tr id="${user.id}" class="table-secondary">
        <td>${user.Name}</td>
        <td>${user.Age}</td>
        <td><button class="edit-btn btn btn-dark btn-sm"><ion-icon name="create-outline"></ion-icon></button></td>
        <td><button class="del-btn btn btn-danger btn-sm"><ion-icon name="trash-outline"></ion-icon></button></td>
      </tr>`;
  });

  // Delete user
  document.querySelectorAll(".del-btn").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const docId = event.target.closest("tr").id;
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then( async (result) => {
        if (result.isConfirmed) {
          await deleteDoc(doc(db, "users", docId));
          displayUsers();
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });
    });
  });

  // Edit user
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", async (event) => {
      updatebtn.style.display = "block";
      Addbtn.style.display = "none";

      const editId = event.target.closest("tr").id;
      const docSnap = await getDoc(doc(db, "users", editId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        inputName.value = data.Name;
        inputAge.value = data.Age;
        currentId = editId;
      }
    });
  });
};

displayUsers();

// Add user
use.addEventListener("click", async () => {
  const Names = inputName.value.trim();
  const Ages = inputAge.value.trim();

  if (!Names || !Ages) {
    Swal.fire("Please Fill Information", "", "warning");
    return;
  }

  Swal.fire({
    title: "Please Wait",
    text: "Uploading...",
    timer: 1500,
    timerProgressBar: true,
    didOpen: () => Swal.showLoading(),
  });

  await addDoc(collection(db, "users"), {
    Name: Names,
    Age: Ages,
  });

  inputName.value = "";
  inputAge.value = "";
  displayUsers();
});

// Update user
updatebtn.addEventListener("click", async () => {
  const newName = inputName.value.trim();
  const newAge = inputAge.value.trim();

  if (!newName || !newAge) {
    Swal.fire("Please fill in both fields", "", "warning");
    return;
  }

  await updateDoc(doc(db, "users", currentId), {
    Name: newName,
    Age: newAge,
  });

  inputName.value = "";
  inputAge.value = "";
  currentId = null;
  updatebtn.style.display = "none";
  Addbtn.style.display = "block";

  Swal.fire("Member Updated!", "", "success");
  displayUsers();
});
