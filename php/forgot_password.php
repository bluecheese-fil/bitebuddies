<?php

  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\Exception;

  require '../PHPMailer/src/Exception.php';
  require '../PHPMailer/src/PHPMailer.php';
  require '../PHPMailer/src/SMTP.php';


  function sendEmail($email, $reset_token){
    $mail = new PHPMailer();
    $mail -> isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'noreply.bitebuddies@gmail.com';
    $mail->Password = '@U!a7D$Fq38$%2FS3QzLgSJ@D';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;
    $mail->setFrom('noreply.bitebuddies@gmail.com', 'NoReply.BiteBuddies');
    $mail->addReplyTo('bitebuddi3s@gmail.com', 'BiteBuddies');
    $mail->Subject = 'Reset your password';
    $mail->isHTML(true);

    // email to send
    $mail->addAddress('info@mailtrap.io');

    $mailContent = "<h1>Send HTML Email using SMTP in PHP</h1>
      <p>This is a test email I’m sending using SMTP mail server with PHPMailer.</p>";
    $mail->Body = $mailContent;

    if(!$mail->send()){
      echo 'Message could not be sent.';
      echo 'Mailer Error: ' . $mail->ErrorInfo;
    } else echo 'Message has been sent';
  }

?>