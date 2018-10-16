var express = require('express');
var router = express();

router.get('/dashboard', (req, res) => {
    
    console.log("bite\n");
    // récupérer day depuis le login pour le paramétrable, lui faire un dépliant de 0 à 3 seulement (ajd à dans 3 jours)
    var day = 0; // de 0 à 3 seulement
    var meteo = "https://www.prevision-meteo.ch/uploads/widget/paris_" + day + ".png";
    var name_of_page = "CodedeBatard"; // modifiable par le nom d'une page fb, pas d'un profil
    var facebook = "https://www.facebook.com/" + name_of_page;
    var yammer_feedid = "16035476";
    var twitter_quote = "https://twitter.com/OfficialPCMR/status/1051682761608757248" + ";ref_src=twsrc%5Etfw"
    console.log("pute\n");
  var drinks = [
      { name: 'Bloody Mary', drunkness: 3 },
      { name: 'Martini', drunkness: 5 },
      { name: 'Scotch', drunkness: 10 }
  ];
  var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";
//  var aboutRouter = require('./about');                                                                
    res.render('../views/pages/dashboard', {
	twitter_quote: twitter_quote,
	facebook: facebook,
	yammer_feedid: yammer_feedid,
	meteo: meteo,
      drinks: drinks,
      tagline: tagline
      //aboutRouter: aboutRouter                                                                         
  });
});

module.exports = router;
