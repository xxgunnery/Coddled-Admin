<?php

$conn = mysqli_connect("localhost","root","","CoddledAdmin");

if (!$conn) {
    echo "Failed to connect to DB " . mysqli_connect_error();
    die("No connection to the host: ". mysqli_connect_error());
}

?>