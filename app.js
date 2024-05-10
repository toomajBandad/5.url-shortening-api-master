const shortenBtn = document.querySelector(".shortenBtn");
const shortenBarInput = document.querySelector("#shortenBar-input");
const readyLinkContainer = document.querySelector(".readyLink-container");

shortenBtn.addEventListener("click", shortenerUrlHandler);
var shortUrl;
var urlListArray;

function loadPageHandler() {
  urlListArray = JSON.parse(localStorage.getItem("urlListArray"));
  console.log(urlListArray);
  showLinksInDom();
}

function shortenerUrlHandler() {
  console.log("shortenerUrlHandler is running");
  requestFromServer();
  setTimeout(() => {
    showLinksInDom();
  }, 1000);
}

function requestFromServer() {
  let longUrl = shortenBarInput.value;
  var myHeaders = new Headers();
  myHeaders.append("apikey", "pIR1pmB67ZMvyFwUitRp8e3TpuIhaJud");
  var requestOptions = {
    method: "POST",
    redirect: "follow",
    headers: myHeaders,
    body: longUrl,
  };
  fetch("https://api.apilayer.com/short_url/hash", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      let shortUrlItem = JSON.parse(result);
      // console.log(shortUrl.short_url);
      shortUrl = shortUrlItem.short_url;
      setUrlToStorage(shortUrl, longUrl);
    })
    .catch((error) => console.log("error", error));
}

function setUrlToStorage(shortUrl, longUrl) {
  if (shortUrl && longUrl) {
    console.log("settostorage is running...");
    console.log(shortUrl, longUrl);
    if (urlListArray == null) {
      selectedId = 1;
      urlListArray = [];
    } else {
      selectedId = urlListArray.length + 1;
    }
    let objectUrl = {
      id: selectedId,
      short: shortUrl,
      long: longUrl,
    };
    urlListArray.push(objectUrl);
    localStorage.setItem("urlListArray", JSON.stringify(urlListArray));
    console.log(urlListArray);
  } else {
    console.log("shortUrl or longUrl is invalid");
  }
}

function showLinksInDom() {
  readyLinkContainer.innerHTML = "";
  console.log("showLinksInDom is running...");
  if (urlListArray) {
    urlListArray.forEach((item) => {
      readyLinkContainer.insertAdjacentHTML(
        "beforeend",
        `
      <div class="readyLink-item" id=${item.id}>
      <div class="readyLink-left">
        <p class="readyLink-long">${item.long}</p>
      </div>
      <div class="readyLink-right">
        <p class="readyLink-short">${item.short}</p>
        <button class="readyLink-copyBtn" onclick="copyLinkHandler(event)" id=${item.id}>copy</button>
      </div>
    </div>
      `
      );
    });
  } else {
    console.log("urlListArray is not valid");
  }
}

function copyLinkHandler(event) {
  // console.log(event.target.id);
  let activeItem;
  let readyLinkElems = document.querySelectorAll(".readyLink-item");
  readyLinkElems.forEach((linkElem) => {
    linkElem.classList.remove("selected");
    linkElem.children[1].children[1].innerHTML = "copy";
    if (linkElem.id == event.target.id) {
      console.log("yes");
      linkElem.classList.add("selected");
      console.log(linkElem.children[1].children[1]);
      linkElem.children[1].children[1].innerHTML = "copied!";
      navigator.clipboard.writeText(linkElem.children[1].children[0].innerHTML);
    } else {
      console.log("no");
    }
  });
}

function hamburgerClickHandler(event) {
  if(event.target.parentElement.parentElement.children[2].style.display == "flex"){
    event.target.parentElement.parentElement.children[2].style.display = "none";
  }else{
    event.target.parentElement.parentElement.children[2].style.display = "flex";
  }

  // event.target.parentElement.nextSibling.style.display = "none";
}
