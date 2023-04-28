<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="/css/homepage.css">
  </head>
  <body onload>
    <?php
      // getting all the arguments
      $email = $_POST["email"];
      $password = $_POST["password"];
      $saveaccount = $_POST["saveaccount"];

      $cipher = "aes-256-cbc";
      $delimiter = chr(007); // bell (licence to kill)

      // Email cannot be set unless the javascript was modified
      if(isset($_COOKIE["saveduser"]) && $email == ""){
        $iv = $_COOKIE["iv"];
        $info = $_COOKIE["saveduser"];

        $info = openssl_decrypt($info, $cipher, "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv);
        $items = preg_split("/{$delimiter}/", $info);
        $user_id = $items[0];
        $email = $items[1];
        $token = $items[2];

        // This is used when updating the token or any other cookie data.
        // It stores (only for the current session) that the user has chosen "remember me"
        setcookie("temporary", "false", $expires_or_options=0, $path="/");

        // This has been set at the end of the file too
      }

      $db = pg_connect("host=localhost port=5432 dbname=BiteBuddies user=bitebuddies password=bites1!") or die('Could not connect:'.pg_last_error());
      $login_query = "
      select user_id, token, passwd
      from utenti
      where email = '{$email}'";

      $result = pg_query($db, $login_query) or die('Query failed:'.pg_last_error());
      $line = pg_fetch_array($result, null, PGSQL_NUM); //array with indexes a number
      pg_free_result($result);
      pg_close($db);

      // In case the cookie was set, I just need to check the token and user
      if(isset($_COOKIE["saveduser"])){
        if(!$user_id == $line[0] || !$token == $line[1]){
          // deleting cookie
          setcookie("iv", "", time() - 3600);
          setcookie("saveduser", "", time() - 3600);
  
          header("Location: /account/login.html?error=passwd_error");
          die();
        } // otherwise this will skip to the end, which results in a login
      } else {
        // otherwise i need to check the password
        if(!password_verify($password, $line[2])){ // they don't match
          // deleting cookie
          setcookie("iv", "", time() - 3600);
          setcookie("saveduser", "", time() - 3600);
            
          header("Location: /account/login.html?error=passwd_error");
          die();
        } else {
          // encrypting the information
          $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length($cipher));
          //line[0] is the userid and line[1] is the token
          $info = openssl_encrypt("{$line[0]}{$delimiter}{$email}{$delimiter}{$line[1]}", "aes-256-cbc", "n5Qh8ST#v#95G!KM4qSQ33^4W%Zy#&", $options=0, $iv);

          if($saveaccount){ //saving the token since "remember me has been selected
            // Expires in 90 days
            $ninetydays = time() + 3600*24*90;

            // I am setting the cookie so that each backslash is saved as such in javascript
            setcookie("saveduser", $info, $expires_or_options=$ninetydays, $path="/");
            setcookie("iv", $iv, $expires_or_options=$ninetydays, $path="/");
            setcookie("temporary", "false", $expires_or_options=0, $path="/");
          } else {
            // This cookie will expire after closing the session. This is used for user identification
            setcookie("saveduser", $info, $expires_or_options=0, $path="/");
            setcookie("iv", $iv, $expires_or_options=0, $path="/");
            setcookie("temporary", "true", $expires_or_options=0, $path="/");
          }
        }
      }
        
      // I then need a redirect in case everything goes perfectly to the homepage! :)
      echo "
      <div>
        Login successful! Please wait, you are being redirected right now
      </div>
      ";
      header("refresh:3; url = /homepg.html");
      die();
    ?>
  </body>
</html>

