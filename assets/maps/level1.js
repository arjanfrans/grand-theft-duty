module.exports = {
    "name": "level 1",
    "width": 5,
    "height": 5,
    "depth": 5,
    "blockWidth": 100,
    "blockHeight": 100,
    "blockDepth": 100,
    "blocks": [
        {
            "position": {
                "x": 0,
                "y": 0,
                "z": 0
            },
            "collidable": true,
            "walls": {
                "top": "grass_center",
                "north": "grass_center",
                "south": "roof1_corner",
                "west": "grass_center",
                "east": "grass_center"
            }
        },
        {
            "position": {
                "x": 4,
                "y": 4,
                "z": 2
            },
            "collidable": true,
            "walls": {
                "top": "dirt_center",
                "north": "dirt_center",
                "south": "dirt_center",
                "west": "grass_center",
                "east": "dirt_center"
            }
        },
        {
            "position": {
                "x": 2,
                "y": 2,
                "z": 2
            },
            "collidable": true,
            "walls": {
                "top": "roof1_edge",
                "north": "roof1_edge",
                "south": "roof1_edge",
                "west": "roof1_edge",
                "east": "roof1_edge"
            }
        },
        {
            "position": {
                "x": 2,
                "y": 1,
                "z": 2
            },
            "collidable": true,
            "walls": {
                "top": "roof1_edge",
                "north": "roof1_edge",
                "south": "roof1_edge",
                "west": "roof1_edge",
                "east": "roof1_edge"
            }
        }
    ]
};
