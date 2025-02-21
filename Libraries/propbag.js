"use strict";

var ga_selected_props = [];

var ge_selected_prop = null;

var gs_prop_id = null;
var gs_prop_data = null;

var gi_prop_x = null;
var gi_prop_y = null;
var gi_prop_w = null;
var gi_prop_h = null;

var ge_prop_bag = Id('prop-bag');
var ge_wear_button = Id('wear-button');
var ge_delete_button = Id('delete-button');


// * Apply random dummy props to _props object.
var _props = [];
setDummyProps();

/**
 * ! Populate Prop Bag
 * 
 */
_props.forEach(prop => {

    const propDiv = document.createElement('div');

    // ? Prop thumbnail data
    propDiv.id = prop.id;
    propDiv.classList.add('prop');
    propDiv.innerHTML = `
    <img 
    src="${prop.src}" 
    data-prop-id="${prop.id}"
    data-prop-data="${prop.data}"
    data-prop-x="${prop.x}"
    data-prop-y="${prop.y}"
    data-prop-w="${prop.w}"
    data-prop-h="${prop.h}"
    />`;

    // ? Prop thumbnail events for ui
    propDiv.addEventListener('click', (event) => {
        if (event.ctrlKey) {
            if (ga_selected_props.includes(propDiv)) {
                propDiv.classList.remove('selected');
                const index = ga_selected_props.indexOf(propDiv);
                if (index > -1) {
                    ga_selected_props.splice(index, 1);
                }
            } else {
                propDiv.classList.add('selected');
                ga_selected_props.push(propDiv);
            }
        } else {
            ga_selected_props.forEach(ge_selected_prop => {
                ge_selected_prop.classList.remove('selected');
            });
            ga_selected_props.length = 0;
            ga_selected_props.push(propDiv);
            propDiv.classList.add('selected');
        }
    });
    // ? Wear all selected on double click
    propDiv.addEventListener('dblclick', () => {
        if (ga_selected_props.includes(propDiv)) {
            ga_selected_props.forEach(ge_selected_prop => {
                animateProp(ge_selected_prop);
                setPropData(ge_selected_prop);
                wearProp(ge_selected_prop);
            });
        } 
    });

    ge_prop_bag.appendChild(propDiv);
});

/**
 * ! Prop Bag Button Events
 */
ge_wear_button.addEventListener('click', () => {
    if (ga_selected_props.length > 0) {
        ga_selected_props.forEach(ge_selected_prop => {
            animateProp(ge_selected_prop);
            setPropData(ge_selected_prop);
            wearProp();
        });
    } else {
        console.log('No items selected');
    }
});

ge_delete_button.addEventListener('click', () => {
    if (ga_selected_props.length > 0) {
        const confirmation = window.confirm('Are you sure you want to delete the selected props?');
        if (confirmation) {
            deleteProp();
        }
    } else {
        console.log('No items selected');
    }
});


/**
 * ! Wear Selected Props
 * @param {*} ge_selected_prop - global element selected prop
 */
function wearProp() {
    // ? Get prop data
    console.log(`
    id: ${gs_prop_id}
    data: ${gs_prop_data}
    x: ${gi_prop_x}
    y: ${gi_prop_y}
    w: ${gi_prop_w}
    h: ${gi_prop_h}
    `);
}

/**
 * ! Delete Selected Props
 */
function deleteProp() {
    ga_selected_props.forEach(ge_selected_prop => {
        const index = _props.findIndex(prop => prop.id === ge_selected_prop.id);
        _props.splice(index, 1);
        ge_prop_bag.removeChild(ge_selected_prop);
        console.log('Deleted: ', ge_selected_prop.querySelector('img').dataset.propId);
    });
    ga_selected_props.length = 0;
}


/**
 * ! Set Prop Data
 * @param {*} element - The selected element
 */
function setPropData(element) {
    gs_prop_id = element.querySelector('img').dataset.propId;
    gs_prop_data = element.querySelector('img').dataset.propData;
    gi_prop_x = element.querySelector('img').dataset.propX;
    gi_prop_y = element.querySelector('img').dataset.propY;
    gi_prop_w = element.querySelector('img').dataset.propW;
    gi_prop_h = element.querySelector('img').dataset.propH;
}

/**
 * ! Animate Prop
 * @param {*} element - The selected element
 */
function animateProp(element) {
    element.classList.add('prop-dbl-click');
    setTimeout(() => {
        element.classList.remove('prop-dbl-click');
    }, 200);
}

/** */

/**
 * ! Dummy props for testing
 */
function setDummyProps() {
    _props = [{
            id: 'item1',
            src: 'https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector.png',
            data: 'data',
            x: 1,
            y: 2,
            w: 3,
            h: 4
        },
        {
            id: 'item2',
            src: 'https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-File.png',
            data: 'data',
            x: 1,
            y: 2,
            w: 3,
            h: 4
        },
        {
            id: 'item3',
            src: 'https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Photo.png',
            data: 'data',
            x: 1,
            y: 2,
            w: 3,
            h: 4
        },
        {
            id: 'item4',
            src: 'https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Image.png',
            data: 'data',
            x: 1,
            y: 2,
            w: 3,
            h: 4
        },
        {
            id: 'item5',
            src: 'https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-Transparent.png',
            data: 'data',
            x: 1,
            y: 2,
            w: 3,
            h: 4
        },
        {
            id: 'item6',
            src: 'https://www.pngall.com/wp-content/uploads/12/Avatar-Transparent.png',
            data: 'data',
            x: 1,
            y: 2,
            w: 3,
            h: 4
        },
        {
            id: 'item7',
            src: 'https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector.png',
            data: 'data',
            x: 1,
            y: 2,
            w: 3,
            h: 4
        },
        {
            id: 'item8',
            src: 'https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-File.png',
            data: 'data',
            x: 1,
            y: 2,
            w: 3,
            h: 4
        },
        {
            id: 'item9',
            src: 'https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Photo.png',
            data: 'data',
            x: 1,
            y: 2,
            w: 3,
            h: 4
        },
        {
            id: 'item10',
            src: 'https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Image.png',
            data: 'data',
            x: 1,
            y: 2,
            w: 3,
            h: 4
        },
        {
            id: 'item11',
            src: 'https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-Transparent.png',
            data: 'data',
            x: 1,
            y: 2,
            w: 3,
            h: 4
        },
        {
            id: 'item12',
            src: 'https://www.pngall.com/wp-content/uploads/12/Avatar-Transparent.png',
            data: 'data',
            x: 1,
            y: 2,
            w: 3,
            h: 4
        },
        {
            id: 'item13',
            src: 'https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector.png',
            data: 'data',
            x: 1,
            y: 2,
            w: 3,
            h: 4
        },
        {
            id: 'item14',
            src: 'https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-File.png',
            data: 'data',
            x: 1,
            y: 2,
            w: 3,
            h: 4
        },
        {
            id: 'item15',
            src: 'https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Photo.png',
            data: 'data',
            x: 1,
            y: 2,
            w: 3,
            h: 4
        },
        {
            id: 'item16',
            src: 'https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Image.png',
            data: 'data',
            x: 1,
            y: 2,
            w: 3,
            h: 4
        },
        {
            id: 'item17',
            src: 'https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-Transparent.png',
            data: 'data',
            x: 1,
            y: 2,
            w: 3,
            h: 4
        },
        {
            id: 'item18',
            src: 'https://www.pngall.com/wp-content/uploads/12/Avatar-Transparent.png',
            data: 'data',
            x: 1,
            y: 2,
            w: 3,
            h: 4
        },
    ];
}