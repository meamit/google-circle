
//Defining the name space
var com = {amit: {}};

//Defining GC=Google circle
com.amit.GC = (function() {
    return {
        addAllFrens: null,
        drawGoogleCircle: function(configObj, onAddCallBack, onRemoveCallBack) {
            var drawHeight = configObj.drawHeight;
            var drawWidth = configObj.drawWidth;
            var circleX = configObj.circleX;
            var circleY = configObj.circleY;
            var circleRadius = configObj.circleRadius;
            var innerCircleRadius = configObj.innerCircleRadius;
            var text = configObj.text;
            var firendsPositionX = configObj.firendsPositionX;
            var firendsPositionY = configObj.firendsPositionY;
            var friendRadius = configObj.friendRadius;


            var friends = configObj.friends;
			var divToDraw = configObj.divToDraw;

            var defaultX = 0;
            var defaultY = 0;
            var angle = 2 * Math.PI / friends.length;
            var positionAtAngle = 0;

            var isScaled = false;



            var paper = Raphael(divToDraw, drawHeight, drawWidth);



            var border_circle = paper.circle(circleX, circleY, circleRadius);

            border_circle.attr({
                fill: '#E4E4E4',
                stroke: '#CECECE',
                'stroke-width': 1
            });
            var base_circle = paper.circle(circleX, circleY, innerCircleRadius);
            base_circle.attr({
                'fill': '#4C97D0',
                stroke: 'none'
            });
            var label = paper.text(circleX, circleY, text, 14);
            label.attr({
                font: "15px Helvetica"
            });
            var circle = paper.set();

            circle.push(
                    label,
                    base_circle,
                    border_circle

                    );
            var friendCircles = new Array();






            var over_x = border_circle.attr('cx') - (border_circle.getBBox().width / 2);
            var over_y = border_circle.attr('cy') - (border_circle.getBBox().width / 2);
            var over_width = border_circle.getBBox().width;
            var over_height = border_circle.getBBox().height;

            //creating frieds circle
            var spaceForEachFriend = drawWidth / friends.length;
            if (spaceForEachFriend > 40) {
                spaceForEachFriend = 40;
            }
            for (var i = 0; i < friends.length; i++) {
                friendCircles[i] = paper.image(friends[i].src, firendsPositionX, firendsPositionY, friendRadius * 2, friendRadius * 2).attr(friends[i]);
                firendsPositionX = firendsPositionX + spaceForEachFriend;
                friendCircles[i].positionAtAngle = positionAtAngle;
                friendCircles[i].friendId = friends[i].friendId;
                friendCircles[i].incircle = false;
                friendCircles[i].defaultX = (Math.cos(positionAtAngle) * (innerCircleRadius + friendRadius)) + circleX - 30;
                friendCircles[i].defaultY = (Math.sin(positionAtAngle) * (innerCircleRadius + friendRadius)) + circleY - 30;
                ;
                //alert(Math.sin(positionAtAngle));
                positionAtAngle = positionAtAngle + angle;

            }

            var over_x_inner = base_circle.attr('cx') - (base_circle.getBBox().width / 2);
            var over_y_inner = base_circle.attr('cy') - (base_circle.getBBox().width / 2);
            var over_width_inner = base_circle.getBBox().width;
            var over_height_inner = base_circle.getBBox().height;


            var onstart = function() {
                this.ox = this.attr("x");
                this.oy = this.attr("y");
                this.attr({opacity: 1});

            }, onmove = function(dx, dy) {
                console.log(this);
                console.log(dy);
                var someOneInside = false;
                this.attr({x: this.ox + dx, y: this.oy + dy});
                if (hasTouchedInner(this)) {
                    this.attr({opacity: .5});
                } else {
                    this.attr({opacity: .8});
                }

                for (var i = 0; i < friendCircles.length; i++) {
                    someOneInside = isInside(friendCircles[i]);
                    if (someOneInside) {
                        break;
                    }
                }
                console.log(someOneInside);
                if (someOneInside) {
                    isScaled = true;
                    //border_circle.scale(1.5, 1.5);
                    border_circle.animate({scale: 1.5}, 50);
                    //border_circle.animate({"stroke-width": 2, "stroke-opacity": 0.5}, 2000)
                    border_circle.attr({
                        stroke: '#4C97D0',
                        'stroke-width': 5
                    });
                } else {
                    isScaled = false;
                    // border_circle.scale(1, 1);
                    border_circle.animate({scale: 1}, 50);
                    border_circle.attr({
                        stroke: '#CECECE',
                        'stroke-width': 1
                    });
                }

            }, onend = function() {
                //if(hasTouchedInner(this)) 
                if (isInside(this)) {
                    this.attr({x: this.defaultX + 10, y: this.defaultY + 10});
                    if (this.incircle == false) {
                        onAddCallBack(this.friendId);
                        this.incircle = true;
                    }


                } else {
                    if (this.incircle == true) {
                        onRemoveCallBack(this.friendId);
                        this.incircle = false;
                    }

                }
                this.attr({opacity: .8});
                reposition(0);
            };


            for (var i = 0; i < friendCircles.length; i++) {
                friendCircles[i].drag(onmove, onstart, onend);
            }

            addAllFrens = function() {
                //addding all friends in the circle
                isScaled = true;
                //border_circle.scale(1.5, 1.5);
                border_circle.animate({scale: 1.5}, 50);
                border_circle.attr({
                    stroke: '#4C97D0',
                    'stroke-width': 5
                });
                for (var i = 0; i < friendCircles.length; i++) {
                    friendCircles[i].attr({x: friendCircles[i].defaultX + 10, y: friendCircles[i].defaultY + 10});
                    onAddCallBack(friendCircles[i].friendId);
                    friendCircles[i].incircle = true;
                }
                reposition(friendCircles.length);
            }
            reposition(friendCircles.length);
            /*function isInside(obj) {
             return (obj.attr('x') >= (over_x-10) && obj.attr('x') <= (over_x+over_width+10)) &&
             (obj.attr('y') >= (over_y-10) && obj.attr('y') <= (over_y+over_height+10))
             }*/
            function isInside(obj) {
                var difX = obj.attr('x') - border_circle.attr('cx') + 20;
                var difY = obj.attr('y') - border_circle.attr('cy') + 20;

                var difXSq = (difX * difX);
                var difYSq = (difY * difY);

                var distance = Math.sqrt(difXSq + difYSq);//usiig the distance formula
                var minDistance = circleRadius + friendRadius;
                if (isScaled) {
                    return minDistance + 35 > distance
                }
                return minDistance > distance;

            }

            function hasTouchedInner(obj) {
                return (obj.attr('x') >= (over_x_inner - 10) && obj.attr('x') <= (over_x_inner + over_width_inner)) &&
                        (obj.attr('y') >= (over_y_inner) && obj.attr('y') <= (over_y_inner + over_height_inner - 10))
            }

            function reposition(val) {

                // find total friends in the circle
                var total = (val > 0) ? val : 0;
                positionAtAngle = 0;
                if (total == 0) {//calculate total
                    for (var i = 0; i < friends.length; i++) {
                        if (friendCircles[i].incircle == true) {
                            total++;
                        }
                    }
                }
                //update angle
                if (total == 0) {
                    return;
                }
                angle = 2 * Math.PI / total;
                // alert(angle);
                for (var i = 0; i < friends.length; i++) {
                    if (friendCircles[i].incircle == false) {
                        continue;
                    }
                    friendCircles[i].positionAtAngle = positionAtAngle;
                    friendCircles[i].defaultX = (Math.cos(positionAtAngle) * (innerCircleRadius + friendRadius)) + circleX - 30;
                    friendCircles[i].defaultY = (Math.sin(positionAtAngle) * (innerCircleRadius + friendRadius)) + circleY - 30;
                    ;
                    positionAtAngle = positionAtAngle + angle;
                    friendCircles[i].attr({x: friendCircles[i].defaultX + 10, y: friendCircles[i].defaultY + 10});

                }
            }
        }
    };
})();

