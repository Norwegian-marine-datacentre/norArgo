<!DOCTYPE HTML SYSTEM>
<%@page pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> 
<html>
    <head>
        <title>NorArgo</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
        <!-- Ext resources -->
        <link rel="stylesheet" type="text/css" href="lib/geoexplorer/ext/ext-all.css">
        <link rel="stylesheet" type="text/css" href="lib/geoexplorer/ext/xtheme-gray.css">
        <script type="text/javascript" src="lib/geoexplorer/ext/ext-base.js"></script>
        <script type="text/javascript" src="lib/geoexplorer/ext/ext-all-debug-w-comments.js"></script>
        
        
        <meta http-equiv="X-UA-Compatible" content="IE=IE8" >
   
        <script type="text/javascript" src="lib/jquery-1.6.2.min.js"></script>       
        <script type="text/javascript">jQuery.noConflict();</script>
        <script src="lib/highcharts.js"></script>

        
        <!-- gxp resources -->
        <link rel="stylesheet" type="text/css" href="lib/geoexplorer/all.css">

        <!-- GeoExplorer resources -->
        <link rel="stylesheet" type="text/css" href="lib/geoexplorer/geoexplorer.css" />
        <!--[if IE]><link rel="stylesheet" type="text/css" href="theme/app/ie.css"/><![endif]-->
        <c:choose>
           <c:when test="${debug}"><script type="text/javascript" src="lib/geoexplorer/GeoExplorer-debug.js"></script></c:when> 
          <c:otherwise><script type="text/javascript" src="lib/geoexplorer/GeoExplorer.js"></script></c:otherwise>  
       </c:choose>
     
        <script type="text/javascript" src="js/norArgoComposer.js"></script>
        <script type="text/javascript" src="js/norArgo.js"></script>
         <link rel="stylesheet" type="text/css" href="css/norArgo.css" />
   
        
    </head>
    <script>
        var headLayer="${headLayer}";
        var tailLayer="${tailLayer}";
        var positionLayer="${positionLayer}";
        var pathLayer="${pathLayer}";
        var floatList=${floatList};
        var floatsByCountry=${floatsByCountry};
        
    </script>
    
    <body >
    </body>
</html>

