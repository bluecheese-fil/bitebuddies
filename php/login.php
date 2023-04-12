<!DOCTYPE html>
<html>
  <head></head>
  <body onload>
    <?php
      // getting all the arguments
      $email = $_POST["email"];
      $password = $_POST["password"];
      $saveaccount = $_POST["saveaccount"];

      $cipher = "aes-256-cbc";
      $delimiter = chr(007); // bell (licence to kill)

      // if email is set, (should happen only if javascript was modified)
      // I'm using the given email and password, discarding the current cookie
      if(isset($_COOKIE["saveduser"]) && $email == ""){
        $iv = $_COOKIE["iv"];
        $info = $_COOKIE["saveduser"];

        $info = openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv);
        $items = preg_split("/{$delimiter}/", $info);
        $email = $items[0];
        $password = $items[1];
      }

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

        if(isset($_COOKIE["saveduser"])){
          // If it was already saved, I just update the timer.
          // This allows the saveduser cookie to be used as a token to identify the user itself accross the website
          $ninetydays = time() + 3600*24*90;
          setcookie("saveduser", $info, $expires_or_options=$ninetydays, $path="/");
          setcookie("iv", $iv, $expires_or_options=$ninetydays, $path="/");
        } else if($saveaccount){
          // encrypting the information
          $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length($cipher));
          $info = openssl_encrypt("{$email}{$delimiter}{$password}", "aes-256-cbc", "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv);
        
          // Expires in 90 days
          $ninetydays = time() + 3600*24*90;
          setcookie("saveduser", $info, $expires_or_options=$ninetydays, $path="/");
          setcookie("iv", $iv, $expires_or_options=$ninetydays, $path="/");
        } else {
          // This cookie will expire after closing the session. This is used for user identification
          setcookie("saveduser", $info, $expires_or_options=0, $path="/");
          setcookie("iv", $iv, $expires_or_options=0, $path="/");
        }
        
        // I then nee a redirect in case everything goes perfectly to the homepage! :)
        //header("");
        //die();
      }
    ?>
  </body>
</html>

