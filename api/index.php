
<?php

require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();
 
$app->get('/links', 'getLinks');
$app->get('/links/:id', 'getLink');
$app->post('/links/', 'addLink');
$app->post('/links/:id', 'updateLink');
$app->delete('/links/:id', 'deleteLink');

 
$app->get('/feeds', 'getfeeds');
$app->get('/feeds/:id', 'getfeed');
$app->post('/feeds/', 'addfeed');
$app->post('/feeds/:id', 'updatefeed');
$app->delete('/feeds/:id', 'deletefeed');




$app->run();

function getLinks() {
    $sql = "select * FROM links ORDER BY position";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $links = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo '{"links": ' . json_encode($links) . '}';
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getLink($id){
    $sql = "select * FROM links where id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $link = $stmt->fetchObject();  
        $db = null;
        echo '{"link": ' . json_encode($link) . '}';
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

}

function addLink(){
    $request = Slim::getInstance()->request();
    $link = json_decode($request->getBody());
    $sql = "INSERT INTO links (title, url, position) VALUES (:title, :url, :position)";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("title", $link->name);
        $stmt->bindParam("url", $link->url);
        $stmt->bindParam("position", $link->position);
        $stmt->execute();
        $wine->id = $db->lastInsertId();
        $db = null;

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }

}

function updateLink($id){

}

function deleteLink($id){
    $sql = "DELETE FROM link WHERE id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $db = null;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

/*
    FEEDS 
*/

function getfeeds() {
    $sql = "select * FROM feeds ORDER BY position";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $feeds = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo '{"feeds": ' . json_encode($feeds) . '}';
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getfeed($id){
    $sql = "select * FROM feeds where id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $feed = $stmt->fetchObject();  
        $db = null;
        echo '{"feed": ' . json_encode($feed) . '}';
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

}

function addfeed(){
    $request = \Slim\Slim::getInstance()->request();
    $feed = json_decode($request->getBody());
    

    $sql = "INSERT INTO feeds (url, position) VALUES (:url, :position)";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("url", $feed->feed->url);
        $stmt->bindParam("position", $feed->feed->position);
        $stmt->execute();
        $wine->id = $db->lastInsertId();
        $db = null;

        $response = \Slim\Slim::getInstance()->response();
        $response['Content-Type'] = 'application/json';
        $response->status(200);
        $response->body(json_encode($feed));


    } catch(Exception $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }

}

function updatefeed($id){

}

function deletefeed($id){
    $sql = "DELETE FROM feed WHERE id=:id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $db = null;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }

}



function getConnection() {
    $dbhost="127.0.0.1";
    $dbuser="root";
    $dbpass="tlmii2";
    $dbname="home";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);  
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}


?>