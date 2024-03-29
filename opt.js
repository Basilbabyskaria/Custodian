// Saves options to chrome.storage
let BASE_URL = "http://localhost:3000"


function buildSaveArray() {
  
  console.log("reached here");
  var element = document.querySelectorAll('.keyword-row');
  for (var i = 0; i < element.length; i++) {
    var obj = {};
    obj.keyword = element[i].querySelector('.keyword input').value;
    obj.type = element[i].querySelector('.type select').value;
    obj.replace = element[i].querySelector('.replace input').value;
    console.log("Object to save", obj);
    insertWordToDatabase(obj);
    //saveArray.push(obj);
  }
  //save_options(saveArray)
}

function insertWordToDatabase(obj) {

  console.log("insert word to database");

  fetch(`${BASE_URL}/insertWord`, {
    method: "POST",
    body: JSON.stringify({
      words: obj,
      user_id: "0",
      is_public: 1
    }),

    // Adding headers to the request
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })

    // Converting to JSON
    .then(response => {
      console.log(response);
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function () {
        status.textContent = '';
      }, 750);
      response.json()
    })

    // Displaying results to console
    .then(json => {
      console.log(json)
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function () {
        status.textContent = '';
      }, 750);
    });

}

function save_options(saveArray) {

  chrome.storage.sync.set({
    keywordsArray: saveArray
  }, function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
  });
}

$(document).ready(function() {
  // RELOAD PAGE ON BUTTON CLICK EVENT.
    $('#save').click(function () {
        location.reload(true); 
    });
});


// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    keywordsArray: []
  }, function (items) {
    buildOptDisplay(items.keywordsArray);
  });
}

function buildOptDisplay(items) {
  if (items.length == 0) {
    document.querySelector('.add-keyword').click();
  }
  for (var i = 0; i < items.length; i++) {
    //items[i] ...
    if (typeof items[i] === "object") {
      createRowWithOptions(items[i], i)
    }
  }
}

function createRowWithOptions(obj, int = 0) {
  console.log('build row', obj);
  var keywordRow = document.querySelector('.keyword-row').innerHTML;

  //remove first item
  if (typeof document.querySelector('.keyword-row').dataset.id === 'undefined') {
    document.querySelector('.keyword-row').remove();
  }

  var newRow = document.createElement('div');
  newRow.className = 'keyword-row';
  var timestamp = (Date.now() + int)
  newRow.dataset.id = timestamp
  newRow.innerHTML = keywordRow;
  document.querySelector('.keywords-holder').appendChild(newRow);

  var newEle = document.querySelector('.keywords-holder .keyword-row[data-id="' + timestamp + '"]')
  newEle.querySelector('.keyword input').value = obj.keyword;
  newEle.querySelector('.type select').value = obj.type;
  if (obj.type == '1') {
    newEle.querySelector('.replace').style.display = 'block';
    newEle.querySelector('.replace input').value = obj.replace;
  } else {
    newEle.querySelector('.replace').style.display = 'none';
  }
  newEle.querySelector('.type select').addEventListener('change', function (e) {
    //.....
    console.log(e);
    var element = e.target;
    var parent = element.parentNode.parentNode;
    if (element.value == '1') {
      parent.querySelector('.replace').style.display = 'block';
    } else {
      parent.querySelector('.replace').style.display = 'none';
    }
  });
  newEle.querySelector('.remove').addEventListener('click', function (e) {
    newEle.remove();
  });
}



//add listener to add keyword button
document.querySelector('.add-keyword').addEventListener('click', function () {
  var obj = {};
  obj.keyword = 'example';
  obj.type = '1';
  obj.replace = 'string';
  createRowWithOptions(obj)
});


document.addEventListener('DOMContentLoaded', restore_options);
console.log("kidding");
console.log(document.getElementById('save'));

document.getElementById('save').addEventListener('click', buildSaveArray);
console.log("kidding2 ");



/*----------------------------------------------------------------------------------- */
//wordtable

function ondelete(id) {

  let _id = id.trim();

  fetch(`${BASE_URL}/deleteKeyword`, {
    method: "POST",
    body: JSON.stringify({
      id: _id
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then(response => console.log(">>>>>", response))
    .then(data => {
      console.log("deleted!!!!");
      loadFromAPI();
    })

}

function loadFromAPI() {

  let tbody = document.getElementById('tbody');
  tbody.innerHTML = "";

  fetch(`${BASE_URL}/getAllKeywords`)
    .then(response => response.json())
    .then(data => {

      tbody.innerHTML = "";
      setTimeout(() => {
        let value = JSON.parse(JSON.stringify(data));
        console.log(value);
        let tbody = document.getElementById('tbody');
        tbody.innerHTML = "";
        let row = "";
        for (i = 0; i < value.length; i++) {
          row = row + `<tr><td>${i + 1}</td><td>${value[i].keyword}</td><td> <input type="hidden" value='${value[i].id}'/> <input type='button' id='${value[i].id}' value="Delete"/></td></tr>`
        }
        tbody.innerHTML = tbody.innerHTML + row;
      }, 200);


    });


  $('#word_table').on('click', 'input[type="button"]', function (e) {
    console.log($(this).closest('tr'));
    let value = $(this).closest('tr').find('input[type="hidden"]').val();
    ondelete(value);
  })

}

loadFromAPI();
document.getElementById('word_table')

