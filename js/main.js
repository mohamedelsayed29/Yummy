let sideBarInnerwidth = $(".sideBar-inner").innerWidth();
function openSideBar() {
  $("#sideBar").animate({ left: "0px" }, 500);
  $(".open-close-icon").removeClass("fa-align-justify");
  $(".open-close-icon").addClass("fa-x");
  for (let i = 0; i < 5; i++) {
    $(".sideBar-links li")
      .eq(i)
      .animate({ top: 0 }, (i + 5) * 100);
  }
}
function closeSideBar() {
  $("#sideBar").animate({ left: -sideBarInnerwidth }, 500);
  $(".open-close-icon").addClass("fa-align-justify");
  $(".open-close-icon").removeClass("fa-x");
  $(".sideBar-links li").animate({ top: 300 }, 500);
}
$(document).ready(function () {
  searchByName("").then(() => {
    $(".overlay").fadeOut(10, function () {
      $("#loading").fadeOut(10, function () {
        $("body").css("overflow", "auto");
        $("#loading").remove();
      });
    });
  });

  $("#sideBar").css("left", -sideBarInnerwidth);
  $(" #sideBar .open-close-icon").click(function () {
    if ($("#sideBar").css("left") == "0px") {
      closeSideBar();
    } else {
      openSideBar();
    }
  });
});

let rowData = document.getElementById("rowData");
let searchContainer = document.getElementById("searchContainer");
let submitBtn;

function displayMeals(arr) {
  let contHTML = ``;
  for (let i = 0; i < arr.length; i++) {
    contHTML += `<div class="col-md-3">
        <div onclick="getMealDetails('${arr[i].idMeal}')" class="meals position-relative overflow-hidden rounded-2">
            <img src="${arr[i].strMealThumb}" class="w-100" alt="">
            <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                <h3>${arr[i].strMeal}</h3>
            </div>
        </div>
    </div>`;
  }
  rowData.innerHTML = contHTML;
}

async function getMealDetails(mealID) {
  rowData.innerHTML = "";
  searchContainer.innerHTML = "";
  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  let responseData = await respone.json();
  displayMealDetails(responseData.meals[0]);
}

function displayMealDetails(meal) {
  searchContainer.innerHTML = "";
  let ingredients = ``;
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  let tags = meal.strTags?.split(",");
  if (!tags) tags = [];

  let tagsStr = "";
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }

  let contHTML = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`;

  rowData.innerHTML = contHTML;
}

async function getCategories() {
  rowData.innerHTML = "";

  searchContainer.innerHTML = "";
  let apiResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let responseData = await apiResponse.json();
  displayCategories(responseData.categories);
}

function displayCategories(arr) {
  let contHTML = ``;
  for (let i = 0; i < arr.length; i++) {
    contHTML += `<div class="col-md-3">
        <div onclick="getCategoryMeals('${
          arr[i].strCategory
        }')" class="meals position-relative overflow-hidden rounded-2">
            <img class="w-100" src="${
              arr[i].strCategoryThumb
            }" alt="" srcset="">
            <div class="meal-layer position-absolute text-center text-black p-2">
                <h3>${arr[i].strCategory}</h3>
                <p>${arr[i].strCategoryDescription
                  .split(" ")
                  .slice(0, 20)
                  .join(" ")}</p>
            </div>
        </div>
</div>`;
  }
  rowData.innerHTML = contHTML;
}

async function getCategoryMeals(category) {
  rowData.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  let responseData = await response.json();
  displayMeals(responseData.meals.slice(0, 20));
}

async function getArea() {
  rowData.innerHTML = "";
  searchContainer.innerHTML = "";

  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let responseData = await respone.json();
  console.log(responseData.meals);

  displayArea(responseData.meals);
}

function displayArea(arr) {
  let contHTML = "";

  for (let i = 0; i < arr.length; i++) {
    contHTML += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center meals">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                </div>
        </div>
        `;
  }

  rowData.innerHTML = contHTML;
}

async function getAreaMeals(area) {
  rowData.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  let responseData = await response.json();
  displayMeals(responseData.meals.slice(0, 20));
}

async function getIngredients() {
  rowData.innerHTML = "";
  searchContainer.innerHTML = "";

  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let responseData = await respone.json();
  console.log(responseData.meals);

  displayIngredients(responseData.meals.slice(0, 20));
}

function displayIngredients(arr) {
  let contHTML = "";

  for (let i = 0; i < arr.length; i++) {
    contHTML += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${
                  arr[i].strIngredient
                }')"  class="rounded-2 text-center meals">
                    <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                    <h3>${arr[i].strIngredient}</h3>
                    <p>${arr[i].strDescription
                      .split(" ")
                      .slice(0, 20)
                      .join(" ")}</p>
                </div>
        </div>
        `;
  }

  rowData.innerHTML = contHTML;
}

async function getIngredientsMeals(ingredients) {
  rowData.innerHTML = "";
  searchContainer.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
  );
  let responseData = await response.json();
  displayMeals(responseData.meals.slice(0, 20));
}

$("#sideBar .search").click(function () {
  closeSideBar();
  displaySearchInputs();
});
$("#sideBar .categories").click(function () {
  closeSideBar();
  getCategories();
});
$("#sideBar .area").click(function () {
  closeSideBar();
  getArea();
});
$("#sideBar .ingredients").click(function () {
  closeSideBar();
  getIngredients();
});
$("#sideBar .contact").click(function () {
  closeSideBar();
  displayContacts();
});

function displaySearchInputs() {
  searchContainer.innerHTML = `
    <div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFirstLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>
    `;
  rowData.innerHTML = "";
}

async function searchByName(term) {
  rowData.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  let responseData = await response.json();
  responseData.meals ? displayMeals(responseData.meals) : displayMeals([]);
}

async function searchByFirstLetter(term) {
  rowData.innerHTML = "";
  term == "" ? (term = "a") : "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`
  );
  let responseData = await response.json();
  responseData.meals ? displayMeals(responseData.meals) : displayMeals([]);
}

function displayContacts() {
  rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
                <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
             <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
           
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `;
  submitBtn = document.getElementById("submitBtn");

  document.getElementById("nameInput").addEventListener("focus", () => {
    nameInputTouched = true;
  });

  document.getElementById("emailInput").addEventListener("focus", () => {
    emailInputTouched = true;
  });

  document.getElementById("phoneInput").addEventListener("focus", () => {
    phoneInputTouched = true;
  });

  document.getElementById("ageInput").addEventListener("focus", () => {
    ageInputTouched = true;
  });

  document.getElementById("passwordInput").addEventListener("focus", () => {
    passwordInputTouched = true;
  });

  document.getElementById("repasswordInput").addEventListener("focus", () => {
    repasswordInputTouched = true;
  });
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

function inputsValidation() {
  if (nameInputTouched) {
    if (nameValidation()) {
      document
        .getElementById("nameAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("nameAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (emailInputTouched) {
    if (emailValidation()) {
      document
        .getElementById("emailAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("emailAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (phoneInputTouched) {
    if (phoneValidation()) {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("phoneAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (ageInputTouched) {
    if (ageValidation()) {
      document
        .getElementById("ageAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("ageAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (passwordInputTouched) {
    if (passwordValidation()) {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("passwordAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (repasswordInputTouched) {
    if (repasswordValidation()) {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-block", "d-none");
    } else {
      document
        .getElementById("repasswordAlert")
        .classList.replace("d-none", "d-block");
    }
  }

  if (
    nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    repasswordValidation()
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}

// Validation contact

function nameValidation() {
  let regex = /^[a-zA-Z ]{2,30}$/;
  return regex.test(document.getElementById("nameInput").value);
}
function emailValidation() {
  let regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(document.getElementById("emailInput").value);
}
function phoneValidation() {
  let regex = /^01[0125][0-9]{8}$/;
  return regex.test(document.getElementById("phoneInput").value);
}
function ageValidation() {
  let regex = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
  return regex.test(document.getElementById("ageInput").value);
}
function passwordValidation() {
  let regex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
  return regex.test(document.getElementById("passwordInput").value);
}
function repasswordValidation() {
  return (
    document.getElementById("repasswordInput").value ==
    document.getElementById("passwordInput").value
  );
}