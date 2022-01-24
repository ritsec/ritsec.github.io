//sponsors.js
// Handles the swapping of sponsor images on the homepage

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
}

    
function reload_sponsors(){
    var images = [
        ['assets/images/sponsorLogos/cisco.png', "https://www.cisco.com/"],['assets/images/sponsorLogos/mitre_logo.png', "https://www.mitre.org/"],['assets/images/sponsorLogos/sra.png', "https://sra.io/"],['assets/images/sponsorLogos/Miscreants2021.png', "https://www.miscreants.co/"],['assets/images/sponsorLogos/MINDEX-RGB.jpg', "https://www.mindex.com/"],['assets/images/sponsorLogos/VinylAgency.png', "https://www.vinylagency.com/"],
    ];
    images = shuffle(images);
    for(i=0;i<4;i++){
        var item = images[i];
        $('#sponsor'+i).attr("src", item[0]);
        $('#sponsor'+i).parent("a").attr("href", item[1]);
    }
    setTimeout(reload_sponsors, 3000);
}

$(document).ready(reload_sponsors());

//TODO Make this more efficient