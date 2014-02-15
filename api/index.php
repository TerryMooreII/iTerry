
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
$app->get('/feeds/category/:id', 'getfeedsByCategoryId');

$app->post('/feeds/', 'addfeed');
$app->put('/feeds/:feedId/category/:categoryId', 'updateFeed');
$app->delete('/feeds/:id', 'deletefeed');

$app->get('/categories', 'getAllCategory');
//$app->get('/categories/:title', 'getCategoryById');
$app->post('/categories/:title', 'addCategory');
$app->post('/categories/:id/:title', 'updateCategory'); //Change categoryid to new name.


$app->run();

//$isProduction = false;

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
    $request = \Slim\Slim::getInstance()->request();
    $link = json_decode($request->getBody());
    

    $sql = "INSERT INTO links (title, url, position) VALUES (:title, :url, :position)";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("title", $link->link->title);
        $stmt->bindParam("url", $link->link->url);
        $stmt->bindParam("position", $link->link->position);
        $stmt->execute();
        $link->id = $db->lastInsertId();
        $db = null;

        $response = \Slim\Slim::getInstance()->response();
        $response['Content-Type'] = 'application/json';
        $response->status(200);
        $response->body(json_encode($link));


    } catch(Exception $e) {
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
    //$sql = "select * FROM feeds order by title";
    //$sql = "select b.feed_id as id, ifnull(a.title, '') as category, a.category_id, b.url, b.feed_url, b.title FROM categories a right join feeds b on a.category_id = b.category_id order by a.category_id, b.title";
    $sql = "select  b.feed_id as id, ifnull(a.title, '') as category, b.url, b.feed_url, b.title from categories a left outer join feeds b on  a.category_id = b.category_id union select b.feed_id as id, ifnull(a.title, '') as category, b.url, b.feed_url, b.title from categories a right outer join  feeds b on a.category_id = b.category_id order by category, title";
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

function getfeedsByCategoryId($id) {
    $sql = "SELECT * FROM feeds WHERE category_id = :id ORDER BY position";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", $id);
        $stmt->execute();
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
        
    $sql = "INSERT INTO feeds (feed_url, url, title) VALUES (:feedUrl, :url, :title)";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("url", $feed->url);
        $stmt->bindParam("feedUrl", $feed->feedUrl);
        $stmt->bindParam("title", $feed->title);
        $stmt->execute();
        $feed->id = $db->lastInsertId();
        $db = null;

        $response = \Slim\Slim::getInstance()->response();
        $response['Content-Type'] = 'application/json';
        $response->status(200);
        $response->body(json_encode($feed));


    } catch(Exception $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }

}

function updateFeed($feedId, $categoryId){
   
    $sql = "UPDATE feeds SET category_id = :categoryId WHERE feed_id = :feedId";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("categoryId", $categoryId);
        $stmt->bindParam("feedId", $feedId);
        $stmt->execute();
        //$feed->id = $db->lastInsertId();
        $db = null;

        $response = \Slim\Slim::getInstance()->response();
        $response['Content-Type'] = 'application/json';
        $response->status(200);
        $response->body("{}");


    } catch(Exception $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }    

}

function deletefeed($id){
    $sql = "DELETE FROM feeds WHERE feed_id=:id";
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


/**
* Category
**/


function getAllCategory(){
    $sql = "select * FROM categories";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $category = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo '{"categories": ' . json_encode($category) . '}';
        
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getCategoryById($id){
    $sql = "select * FROM categories where id=:id";
    try {
        $db = getConnection();
        $stmt->bindParam("id", id);
        $stmt = $db->query($sql);
        $category = $stmt->fetch(PDO::FETCH_OBJ);
        $db = null;
        echo '{"categories": ' . json_encode($category) . '}';
        
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function addCategory($title){
    
    $sql = "INSERT INTO categories (title) VALUES (:title)";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("title", $title);
        $stmt->execute();
        //$category->id = $db->lastInsertId();
        $db = null;

        $response = \Slim\Slim::getInstance()->response();
        $response['Content-Type'] = 'application/json';
        $response->status(200);
        $response->body("");

        //echo '{"categories": ' . json_encode($category) . '}';
        
    } catch(Exception $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}

function updateCategory($id, $title){
    
    $sql = "UPDATE categories set title = :title where category_id = :id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);  
        $stmt->bindParam("title", $title);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        //$category->id = $db->lastInsertId();
        $db = null;

        $response = \Slim\Slim::getInstance()->response();
        $response['Content-Type'] = 'application/json';
        $response->status(200);
        $response->body("");

        //echo '{"categories": ' . json_encode($category) . '}';
        
    } catch(Exception $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}'; 
    }
}


function getConnection() {
    
    $dbhost="127.0.0.1";
    $dbuser="root";
    $dbpass="tlmii2";
    $dbname="home";

    // if (isProduction){
    //     $dbhost="127.0.0.1";
    //     $dbuser="motesh_iTerry";
    //     $dbpass="8[eF=!oFK!8R";
    //     $dbname="iTerry";
    // }

    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);  
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}


?>