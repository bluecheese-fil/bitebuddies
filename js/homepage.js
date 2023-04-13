function quitUser(){
  document.cookie = "saveduser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "iv=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  location.reload();
}