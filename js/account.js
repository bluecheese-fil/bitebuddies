function showChange(id, n){
  if(id.style.opacity == 0){
    id.style.opacity = "1";
    id.style.visibility = "visible";
  } else {
    id.style.opacity = "0";
    id.style.visibility = "hidden";
  }
}