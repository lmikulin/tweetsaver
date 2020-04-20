const form = document.forms.inputform;
const tweetsBin = $("#tweets");
const dropList = $("#droplist");
 
form.onsubmit = event => {
  event.preventDefault();
  const keyword = form.keyword.value;

  const url = `http://tweetsaver.herokuapp.com/?q=${keyword}&callback=handleTweetsResponse&count=10`;

  $.ajax({
    url,
    dataType: "jsonp"
  });
};

// populate the tweets bin
function handleTweetsResponse(data) {
  tweetsBin.empty();

  const stamp = (new Date()).getTime();
  let nodesTxt = "";

  data.tweets.forEach((tweet, index) => {
    nodesTxt += `<li id='${stamp}-${index}' class='list-group-item tweet-row' draggable='true' ondragstart='dragstart_handler(event)'><img src='${tweet.user.profileImageURL}'><p><label>${tweet.user.name}</label> @${tweet.user.screenName}<br/>${tweet.text}</p></li>`;
  });

  tweetsBin.append(`<ul class="list-group">${nodesTxt}</ul>`);
}

// source twitter set the drag and drop id
function dragstart_handler(event) {
  event.dataTransfer.setData("sourcetweet", event.target.id);
}

// handle drop
const dropBin = document.querySelector("#dropbin");

dropBin.ondrop = event => {
  const sourceId = event.dataTransfer.getData("sourcetweet");

  if (sourceId) {
    const node = document.getElementById(sourceId);

    if (node) {
      dropList.prepend(node);
  
      // add this item to the local storage
      const list = JSON.parse(localStorage.savedTweets);
      list.unshift(node.innerHTML);
      localStorage.savedTweets = JSON.stringify(list);
    }
  }
}

dropBin.ondragover = event => {
  event.preventDefault();
}

// initialize the saved tweets list on page load
$(function() {
  if (!localStorage.savedTweets) {
    localStorage.savedTweets = JSON.stringify([]);
  }
  const list = JSON.parse(localStorage.savedTweets);
  let nodesTxt = "";
  list.forEach((tweet) => {
    nodesTxt += `<li class='list-group-item tweet-row'>${tweet}</li>`;
  });
  dropList.append(nodesTxt);
});
