<!DOCTYPE html>
<html>
  <head></head>
  <body onload>
    <?php
      // getting all the arguments
      $email = $_POST["email"];
      $password = $_POST["password"];
      $saveaccount = $_POST["saveaccount"];

      $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());

      $password_query = "
      select passwd
      from utenti
      where email = '{$email}'";

      $result = pg_query($db, $password_query) or die('Query failed:'.pg_last_error());
      $line = pg_fetch_array($result, null, PGSQL_NUM); //array with indexes a number
      $hashedpasswd = $line[0];
      pg_free_result($result);
      pg_close($db);

      $isCorrect = password_verify($password, $hashedpasswd);

      // In case of an error, I send this back to the login with the error
      if(!$isCorrect){
        header("Location: /account/login.html?error=passwd_error");
        die();
      } else {

        // I'm going to set the cookie that remembers email and password
        if($saveaccount){
          echo "
          <script>
            saveduser = JSON.stringify({email: \"{$email}\", password: \"{$password}\"});
            localStorage.setItem(\"saveduser\", saveduser);
            localStorage.removeItem(\"savedemail\");

            document.getElementById(\"user\").textContent = saveduser;
          </script>
          ";
        }
      }

      // I then need a redirect in case everything goes perfectly! :)
    ?>
  </body>
</html>

