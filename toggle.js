var replace =document.getElementById("replace_toggle");
var blurr =document.getElementById("blur_toggle");
var remove =document.getElementById("remove_togle");
replace.addEventListener("click", function() {
    if(replace.checked === true)
    {
    blurr.checked=false;
    remove.checked=false;
    }
  });
  blurr.addEventListener("click", function() {
    if(blurr.checked === true)
    {
    replace.checked=false;
    remove.checked=false;
    }
  });
  remove.addEventListener("click", function() {
    if(remove.checked === true)
    {
    blurr.checked=false;
    replace.checked=false;
    }
  });