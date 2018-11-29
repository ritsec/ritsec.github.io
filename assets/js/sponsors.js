---
---
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

$(document).ready(function(){
    var images = [
        {% for sponsor in site.data.sponsors %}['assets/images/sponsorLogos/{{ sponsor.image }}', "{{ sponsor.link }}"],{% endfor %}
    ];
    images = shuffle(images);
    for(i=0;i<4;i++){
        var item = images[i];
        $('#sponsor'+i).attr("src", item[0]);
        $('#sponsor'+i).parent("a").attr("href", item[1]);
    }
});

