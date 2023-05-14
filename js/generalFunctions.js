function quitUser(redirect = null){
  document.cookie = "saveduser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "iv=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "temporary=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  if(redirect != null) document.location.href = redirect;
}