/* global jQuery */
/* global document */
/* jshint -W097 */
/* jshint strict: false */
/*
 MIT, Copyright 2014-2018 bluefox <dogafox@gmail.com>, soef <soef@gmx.net>

 version: 1.1.0 (2017.12.28)

 To use this dialog as standalone in ioBroker environment include:
 <link type="text/css" rel="stylesheet" href="lib/css/redmond/jquery-ui.min.css">
 <link rel="stylesheet" type="text/css" href="lib/css/fancytree/ui.fancytree.min.css"/>

 <script type="text/javascript" src="lib/js/jquery-1.11.1.min.js"></script>
 <script type="text/javascript" src="lib/js/jquery-ui-1.10.3.full.min.js"></script>
 <script type="text/javascript" src="lib/js/jquery.fancytree-all.min.js"></script>
 <script type="text/javascript" src="js/translate.js"></script>
 <script type="text/javascript" src="js/words.js"></script><!--this file must be after translate.js -->

 <script type="text/javascript" src="js/selectID.js"></script>

 <script src="lib/js/socket.io.js"></script>
 <script src="/_socket/info.js"></script>

 To use as part, just
 <link rel="stylesheet" type="text/css" href="lib/css/fancytree/ui.fancytree.min.css"/>
 <script type="text/javascript" src="lib/js/jquery.fancytree-all.min.js"></script>
 <script type="text/javascript" src="js/selectID.js"></script>

 Interface:
 +  init(options) - init select ID dialog. Following options are supported
         {
             currentId:  '',       // Current ID or empty if nothing preselected
             objects:    null,     // All objects that should be shown. It can be empty if connCfg used.
             getObjects: null,     // null or function to read all objects anew on refresh (because of subscripitons): funsubscriptionsjects) {}
             states:     null,     // All states of objects. It can be empty if connCfg used. If objects are set and no states, states will no be shown.
             filter:     null,     // filter
             imgPath:    'lib/css/fancytree/', // Path to images device.png, channel.png and state.png
             connCfg:    null,     // configuration for dialog, ti read objects itself: {socketUrl: socketUrl, socketSession: socketSession}
             onSuccess:  null,     // callback function to be called if user press "Select". Can be overwritten in "show" - function (newId, oldId, newObj)
             onChange:   null,     // called every time the new object selected - function (newId, oldId, newObj)
             noDialog:   false,    // do not make dialog
             noMultiselect: false, // do not make multiselect
             buttons:    null,     // array with buttons, that should be shown in last column
                                   // if array is not empty it can has following fields
                                   // [{
                                   //   text: false, // same as jquery button
                                   //   icons: {     // same as jquery bdata.columnsutton
                                   //       primary: 'ui-icon-gear'
                                   //   },
                                   //   click: function (id) {
                                   //                // do on click
                                   //   },
                                   //   match: function (id) {
                                   //                // you have here object "this" pointing to $('button')
                                   //   },
                                   //   width: 26,   // same as jquery button
                                   //   height: 20   // same as jquery button
                                   // }],
             panelButtons: null,   // array with buttons, that should be shown at the top of dialog (near expand all)
             list:       false,    // tree view or list view
             name:       null,     // name of the dialog to store filter settings
             noCopyToClipboard: false, // do not show button for copy to clipboard
             root:       null,     // root node, e.g. "script.js"
             useNameAsId: false,   // use name of object as ID
             noColumnResize: false, // do not allow column resize
             firstMinWidth: null,  // width if ID column, default 400
             showButtonsForNotExistingObjects: false,
             webServer:    null,   // link to webserver, by default ":8082"
             filterPresets: null,  // Object with predefined filters, eg {role: 'level.dimmer'} or {type: 'state'}
             roleExactly:   false, // If the role must be equal or just content the filter value
             sortConfig: {
                     statesFirst: true,     // Show states before folders
                     ignoreSortOrder: false // Ignore standard sort order of fancytree
             },
             texts: {
                 select:   'Select',
                 cancel:   'Cancel',
                 all:      'All',
                 id:       'ID',
                 name:     'Name',
                 role:     'Role',
                 type:     'Type',
                 room:     'Room',
                 'function': 'Function',
                 enum:     'Members',
                 value:    'Value',
                 selectid: 'Select ID',
                 from:     'From',
                 lc:       'Last changed',
                 ts:       'Time stamp',
                 ack:      'Acknowledged',
                 expand:   'Expand all nodes',
                 collapse: 'Collapse all nodes',
                 refresh:  'Rebuild tree',
                 edit:     'Edit',
                 ok:       'Ok',
                 push:     'Trigger event'
                 wait:     'Processing...',
                 list:     'Show list view',
                 tree:     'Show tree view',
                 selectAll: 'Select all',
                 unselectAll: 'Unselect all',
                 invertSelection: 'Invert selection',
                 copyToClipboard: 'Copy to clipboard',
                 expertMode: 'Toggle expert mode',
                 button: 'History'
             },
             columns: ['image', 'name', 'type', 'role', 'enum', 'room', 'function', 'value', 'button'],
                                // some elements of columns could be an object {name: field, data: function (id, name){}, title: function (id, name) {}}
             widths:    null,   // array with width for every column
             editEnd:   null,   // function (id, newValues) for edit lines (only id and name can be edited)
             editStart: null,   // function (id, $inputs) called after edit start to correct input fields (inputs are jquery objects),
             zindex:    null,   // z-index of dialog or table
             customButtonFilter: null, // if in the filter over the buttons some specific button must be shown. It has type like {icons:{primary: 'ui-icon-close'}, text: false, callback: function ()}
             expertModeRegEx: null // list of regex with objects, that will be shown only in expert mode, like  /^system\.|^iobroker\.|^_|^[\w-]+$|^enum\.|^[\w-]+\.admin/
             quickEdit:  null,   // list of fields with edit on click. Elements can be just names from standard list or objects like:
                                 // {name: 'field', options: {a1: 'a111_Text', a2: 'a22_Text'}}, options can be a function (id, name), that give back such an object
             quickEditCallback: null, // function (id, attr, newValue, oldValue),
             readyCallback: null // called when objects and states are read from server (only if connCfg is not null). function (err, objects, states)
             expandedCallback: null, // called when some node was expanded. function(id, childrenCount, statesCount)
             collapsedCallback: null, // called when some node was expanded. function(id, childrenCount, statesCount)
        }
 +  show(currentId, filter, callback) - all arguments are optional if set by "init". Callback is like function (newId, oldId) {}. If multiselect, so the arguments are arrays.
 +  clear() - clear object tree to read and build anew (used only if objects set by "init")
 +  getInfo(id) - get information about ID
 +  getTreeInfo(id) - get {id, parent, children, object}
 +  state(id, val) - update states in tree
 +  object(id, obj) - update object info in tree
 +  reinit() - draw tree anew


 filter is like:
     common: {
         history: true
     }
  or
     type: "state"
 */

var addAll2FilterCombobox = false;

function tdp(x, nachkomma) {
    return isNaN(x) ? "" : x.toFixed(nachkomma || 0).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function removeImageFromSettings(data) {
    if (!data || !data.columns) return;
    var idx = data.columns.indexOf('image');
    if (idx >= 0) data.columns.splice(idx, 1);
}

var lineIndent = '5px';
var xytdButton = { width: 20, height: 20 };
function span(txt, attr) {
    //if (txt === undefined) txt = '';
    //return txt;

    var style = 'padding-left: ' + lineIndent + ';';
    if (attr) style += attr;
    return '<span style="' + style + '">' + txt + '</span>';
}

function filterChanged(e) {
    var $e = $(e);
    var val = $e.val ();
    var tr = $e.parent ().parent ();
    tr.find ('td').last().css ({'display': val ? 'unset' : 'none'});   //
    tr [val ? 'addClass' : 'removeClass'] ('filter-active');         // set background of <tr>
    tr.find('button').attr('style' , 'background: transparent !important;');
}


(function ($) {
    'use strict';

    if ($.fn.selectId) return;

    var ICON_MINIMAL_BASE64_SIZE = 312;

    function getName(obj, id) {
        if (obj && obj.common) {
            var rName = obj.common.name || (id || '').split('.').pop();
            if (typeof rName === 'object') {
                rName = rName[systemLang] || rName.en;
            }
            return rName;
        } else {
            return (id || '').split('.').pop();
        }
    }

    function formatDate(dateObj) {
        //return dateObj.getFullYear() + '-' +
        //    ('0' + (dateObj.getMonth() + 1).toString(10)).slice(-2) + '-' +
        //    ('0' + (dateObj.getDate()).toString(10)).slice(-2) + ' ' +
        //    ('0' + (dateObj.getHours()).toString(10)).slice(-2) + ':' +
        //    ('0' + (dateObj.getMinutes()).toString(10)).slice(-2) + ':' +
        //    ('0' + (dateObj.getSeconds()).toString(10)).slice(-2);
        // Following implementation is 5 times faster
        if (!dateObj) return '';

        var text = dateObj.getFullYear();
        var v = dateObj.getMonth() + 1;
        if (v < 10) {
            text += '-0' + v;
        } else {
            text += '-' + v;
        }

        v = dateObj.getDate();
        if (v < 10) {
            text += '-0' + v;
        } else {
            text += '-' + v;
        }

        v = dateObj.getHours();
        if (v < 10) {
            text += ' 0' + v;
        } else {
            text += ' ' + v;
        }
        v = dateObj.getMinutes();
        if (v < 10) {
            text += ':0' + v;
        } else {
            text += ':' + v;
        }

        v = dateObj.getSeconds();
        if (v < 10) {
            text += ':0' + v;
        } else {
            text += ':' + v;
        }

        v = dateObj.getMilliseconds();
        if (v < 10) {
            text += '.00' + v;
        } else if (v < 100) {
            text += '.0' + v;
        } else {
            text += '.' + v;
        }

        return text;
    }

    function filterId(data, id) {
        if (data.rootExp) {
            if (!data.rootExp.test(id)) return false;
        }
        // ignore system objects in expert mode
        if (data.expertModeRegEx && !data.expertMode && data.expertModeRegEx.test(id)) {
            return false;
        }

        if (data.filter) {
            if (data.filter.type && data.filter.type !== data.objects[id].type) return false;

            if (data.filter.common && data.filter.common.custom) {
                if (!data.objects[id].common) return false;
                // todo: remove history sometime 09.2016
                var custom = data.objects[id].common.custom || data.objects[id].common.history;

                if (!custom) return false;
                if (data.filter.common.custom === true) {
                    return true;
                } else {
                    if (!custom[data.filter.common.custom]) return false;
                }
            }
        }
        return true;
    }

    function getExpandeds(data) {
        if (!data.$tree) return null;
        var expandeds = {};
        (function getIt(nodes) {
            if (!Array.isArray(nodes.children)) return;
            for (var i = 0, len = nodes.children.length; i < len; i++) {
                var node = nodes.children[i];
                if (node.expanded) {
                    expandeds[node.key] = true;
                }
                getIt(node);
            }
        })(data.$tree.fancytree('getRootNode'));
        return expandeds;
    }

    function restoreExpandeds(data, expandeds) {
        if (!expandeds || !data.$tree) return;
        (function setIt(nodes) {
            if (!Array.isArray(nodes.children)) return;
            for (var i = 0, len = nodes.children.length; i < len; i++) {
                var node = nodes.children[i];
                if (expandeds[node.key]) {
                    node.setExpanded();
                    //node.setActive();
                }
                setIt(node);
            }
        })(data.$tree.fancytree('getRootNode'));
        expandeds = null;
    }

    function sortTree(data) {
        var objects = data.objects;
        var checkStatesFirst;
        switch (data.sortConfig.statesFirst) {
            case undefined: checkStatesFirst = function() { return 0 }; break;
            case true:      checkStatesFirst = function(child1, child2) { return ((~~child2.folder) - (~~child1.folder))}; break;
            case false:     checkStatesFirst = function(child1, child2) { return ((~~child1.folder) - (~~child2.folder))}; break;
        }

        // function compAdapterAndInstance(c1, c2) {
        //     var s1 = c1.key.substr(0, c1.key.lastIndexOf('.'));
        //     var s2 = c2.key.substr(0, c2.key.lastIndexOf('.'));
        //
        //     if (s1 > s2) return 1;
        //     if (s1 < s2) return -1;
        //     return 0;
        // }

        function sortByName(child1, child2) {
            var ret = checkStatesFirst(child1, child2);
            if (ret) return ret;

            var o1 = objects[child1.key], o2 = objects[child2.key];
            if (o1 && o2) {
                var c1 = o1.common, c2 = o2.common;
                if (c1 && c2) {

                    // var s1 = child1.key.substr(0, child1.key.lastIndexOf('.')); // faster than regexp.
                    // var s2 = child2.key.substr(0, child2.key.lastIndexOf('.'));
                    // if (s1 > s2) return 1;
                    // if (s1 < s2) return -1;

                    if (!data.sortConfig.ignoreSortOrder && c1.sortOrder && c2.sortOrder) {
                        if (c1.sortOrder > c2.sortOrder) return 1;
                        if (c1.sortOrder < c2.sortOrder) return -1;
                        return 0;
                    }
                    var name1;
                    var name2;
                    if (c1.name) {
                        if (typeof c1.name === 'object') {
                            name1 = (c1.name[systemLang] || c1.name.en).toLowerCase();
                        } else {
                            name1 = c1.name.toLowerCase();
                        }
                    } else {
                        name1 = child1.key;
                    }
                    if (c2.name) {
                        if (typeof c2.name === 'object') {
                            name2 = (c2.name[systemLang] || c2.name.en).toLowerCase();
                        } else {
                            name2 = c2.name.toLowerCase();
                        }
                    } else {
                        name2 = child1.key;
                    }
                    if (name1 > name2) return 1;
                    if (name1 < name2) return -1;
                }
            }
            if (child1.key > child2.key) return 1;
            if (child1.key < child2.key) return -1;
            return 0;
        }

        function sortByKey(child1, child2) {
            var ret = checkStatesFirst(child1, child2);
            if (ret) return ret;
            if (!data.sortConfig.ignoreSortOrder) {
                var o1 = objects[child1.key], o2 = objects[child2.key];
                if (o1 && o2) {
                    var c1 = o1.common, c2 = o2.common;
                    if (c1 && c2 && c1.sortOrder && c2.sortOrder) {
                        // var s1 = child1.key.substr(0, child1.key.lastIndexOf('.'));  // faster than regexp.
                        // var s2 = child2.key.substr(0, child2.key.lastIndexOf('.'));
                        // if (s1 > s2) return 1;
                        // if (s1 < s2) return -1;

                        if (c1.sortOrder > c2.sortOrder) return 1;
                        if (c1.sortOrder < c2.sortOrder) return -1;
                        return 0;
                    }
                }
            }
            if (child1.key > child2.key) return 1;
            if (child1.key < child2.key) return -1;
            return 0;
        }

        var sortFunc = data.sort ? sortByName : sortByKey;
        var sfunc = sortByKey; // sort the root always by key
        return (function sort(tree) {
            if (!tree || !tree.children) return;
            tree.sortChildren(sfunc);
            sfunc = sortFunc;
            for (var i=tree.children.length-1; i>=0; i--) {
                sort(tree.children[i]);
            }
        })(data.$tree.fancytree('getRootNode'));

        // var sortFunc = data.sort ? sortByName : sortByKey;
        // var root = data.$tree.fancytree('getRootNode');
        // root.sortChildren(sortByKey, false);
        // return (function sort(tree) {
        //     if (!tree) return;
        //     for (var i=tree.children.length-1; i>=0; i--) {
        //         var child = tree.children[i];
        //         if (!child) return;
        //         child.sortChildren(sortFunc);
        //         sort(child.children);
        //     }
        // })(root.children);


        //data.$tree.fancytree('getRootNode').sortChildren(data.sort ? sortByName : sortByKey, true);
        //var tree = data.$tree.fancytree('getTree');
        //var node = tree.getActiveNode();
    }

    function getAllStates(data) {
        var objects = data.objects;
        var isType  = data.columns.indexOf('type') !== -1;
        var isRoom  = data.columns.indexOf('room') !== -1;
        var isFunc  = data.columns.indexOf('function') !== -1;
        var isRole  = data.columns.indexOf('role') !== -1;
        var isHist  = data.columns.indexOf('button') !== -1;

        data.tree = {title: '', children: [], count: 0, root: true};
        data.roomEnums = [];
        data.funcEnums = [];
        data.ids       = [];

        for (var id in objects) {
            if (!objects.hasOwnProperty(id)) continue;
            if (!id) {
                console.error('Invalid empty ID found! Please fix it');
                continue;
            }
            if (isRoom) {
                if (objects[id].type === 'enum' && data.regexEnumRooms.test(id) && data.roomEnums.indexOf(id) === -1) data.roomEnums.push(id);
                if (objects[id].enums) {
                    for (var e in objects[id].enums) {
                        if (data.regexEnumRooms.test(e) && data.roomEnums.indexOf(e) === -1) {
                            data.roomEnums.push(e);
                        }
                        data.objects[e] = data.objects[e] || {
                            _id: e,
                            common: {
                                name: objects[id].enums[e],
                                members: [id]
                            }
                        };
                        data.objects[e].common.members = data.objects[e].common.members || [];
                        if (data.objects[e].common.members.indexOf(id) === -1) {
                            data.objects[e].common.members.push(id);
                        }
                    }
                }
            }
            if (isFunc) {
                if (objects[id].type === 'enum' && data.regexEnumFuncs.test(id)  && data.funcEnums.indexOf(id) === -1) {
                    data.funcEnums.push(id);
                }
                if (objects[id].enums) {
                    for (var e in objects[id].enums) {
                        if (data.regexEnumFuncs.test(e) && data.funcEnums.indexOf(e) === -1) {
                            data.funcEnums.push(e);
                        }
                        data.objects[e] = data.objects[e] || {
                            _id: e,
                            common: {
                                name: objects[id].enums[e],
                                members: [id]
                            }
                        };
                        data.objects[e].common.members = data.objects[e].common.members || [];
                        if (data.objects[e].common.members.indexOf(id) === -1) {
                            data.objects[e].common.members.push(id);
                        }
                    }
                }
            }

            if (isType && objects[id].type && data.types.indexOf(objects[id].type) === -1) data.types.push(objects[id].type);

            if (isRole && objects[id].common && objects[id].common.role) {
                try {
                    var parts = objects[id].common.role.split('.');
                    var role = '';
                    for (var u = 0; u < parts.length; u++) {
                        role += (role ? '.' : '') + parts[u];
                        if (data.roles.indexOf(role) === -1) data.roles.push(role);
                    }
                } catch (e) {
                    console.error('Cannot parse role "' + objects[id].common.role + '" by ' + id);
                }
            }
            if (isHist && objects[id].type === 'instance' && (objects[id].common.type === 'storage' || objects[id].common.supportCustoms)) {
                var h = id.substring('system.adapter.'.length);
                if (data.histories.indexOf(h) === -1) {
                    data.histories.push(h);
                }
            }

            if (!filterId(data, id)) continue;

            treeInsert(data, id, data.currentId === id);

            if (objects[id].enums) {
                for (var ee in objects[id].enums) {
                    if (objects[id].enums.hasOwnProperty(ee) &&
                        objects[ee] &&
                        objects[ee].common &&
                        objects[ee].common.members &&
                        objects[ee].common.members.indexOf(id) === -1) {
                        objects[ee].common.members.push(id);
                    }
                }
            }
            // fill counters
            if (data.expertMode) {
                data.ids.push(id);
            }
        }
        data.inited = true;
        data.roles.sort();
        data.types.sort();
        data.roomEnums.sort();
        data.funcEnums.sort();
        data.histories.sort();
        data.ids.sort();
    }

    function treeSplit(data, id) {
        if (!id) return null;
        if (data.root) {
            id = id.substring(data.root.length);
        }

        var parts = id.split('.');
        if (data.regexSystemAdapter.test(id)) {
            if (parts.length > 3) {
                parts[0] = 'system.adapter.' + parts[2] + '.' + parts[3];
                parts.splice(1, 3);
            } else {
                parts[0] = 'system.adapter.' + parts[2];
                parts.splice(1, 2);
            }
        } else if (data.regexSystemHost.test(id)) {
            parts[0] = 'system.host.' + parts[2];
            parts.splice(1, 2);
        } else if (parts.length > 1 && !data.root) {
            parts[0] = parts[0] + '.' + parts[1];
            parts.splice(1, 1);
        }

        /*if (optimized) {
         parts = treeOptimizePath(parts);
         }*/

        return parts;
    }

    function _deleteTree(node, deletedNodes) {
        if (node.parent) {
            if (deletedNodes && node.id) {
                deletedNodes.push(node);
            }
            var p = node.parent;
            if (p.children.length <= 1) {
                _deleteTree(node.parent);
            } else {
                for (var z = 0; z < p.children.length; z++) {
                    if (node.key === p.children[z].key) {
                        p.children.splice(z, 1);
                        break;
                    }
                }
            }
        } else {
            //error
        }
    }

    function deleteTree(data, id, deletedNodes) {
        var node = findTree(data, id);
        if (!node) {
            console.log('deleteTree: Id ' + id + ' not found');
            return;
        }
        _deleteTree(node, deletedNodes);
    }

    function findTree(data, id) {
        return (function find(tree) {
            if (!tree.children) return;
            for (var i = tree.children.length - 1; i >= 0; i--) {
                var child = tree.children[i];
                if (id === child.key) return child;
                if (id.startsWith(child.key + '.')) {
                    //if (id === child.key) return child;
                    return find(child);
                }
            }
            return null;
        })(data.tree);
    }

    // function xfindTree(data, id) {
    //     return _findTree(data.tree, treeSplit(data, id, false), 0);
    // }
    // function _findTree(tree, parts, index) {
    //     var num = -1;
    //     for (var j = 0; j < tree.children.length; j++) {
    //         if (tree.children[j].title === parts[index]) {
    //             num = j;
    //             break;
    //         }
    //         //if (tree.children[j].title > parts[index]) break;
    //     }
    //
    //     if (num === -1) return null;
    //
    //     if (parts.length - 1 === index) {
    //         return tree.children[num];
    //     } else {
    //         return _findTree(tree.children[num], parts, index + 1);
    //     }
    // }

    /*
    function treeInsert(data, id, isExpanded, addedNodes) {
        var idArr = data.list ? [id] : treeSplit(data, id);
        if (!idArr) return console.error('Empty object ID!');

        (function insert(tree, idx) {
            for ( ; idx < idArr.length; idx += 1) {
                for (var i = tree.children.length - 1; i >= 0; i--) {
                    var child = tree.children[i];
                    if (id === child.key) return child;
                    if (id.startsWith (child.key + '.')) {
                        //if (id === child.key) return child;
                        child.expanded = child.expanded || isExpanded;
                        return insert (child, idx + 1);
                    }
                }
                tree.folder = true;
                tree.expanded = isExpanded;

                var obj = {
                    key: (data.root || '') + idArr.slice (0, idx + 1).join ('.'),
                    children: [],
                    title: idArr[idx],
                    folder: false,
                    expanded: false,
                    parent: tree
                };
                //data.objects[obj.key].node = obj;
                tree.children.push (obj);
                if (addedNodes) {
                    addedNodes.push (obj);
                }
                tree = obj;
            }
            tree.id = id;
        })(data.tree, 0);
    } */


    function treeInsert(data, id, isExpanded, addedNodes) {
        return _treeInsert(data.tree, data.list ? [id] : treeSplit(data, id, false), id, 0, isExpanded, addedNodes, data);
    }
    function _treeInsert(tree, parts, id, index, isExpanded, addedNodes, data) {
        index = index || 0;

        if (!parts) {
            console.error('Empty object ID!');
            return;
        }

        var num = -1;
        var j;
        for (j = 0; j < tree.children.length; j++) {
            if (tree.children[j].title === parts[index]) {
                num = j;
                break;
            }
            //if (tree.children[j].title > parts[index]) break;
        }

        if (num === -1) {
            tree.folder   = true;
            tree.expanded = isExpanded;

            var fullName = '';
            for (var i = 0; i <= index; i++) {
                fullName += ((fullName) ? '.' : '') + parts[i];
            }
            var obj = {
                key:      (data.root || '') + fullName,
                children: [],
                title:    parts[index],
                folder:   false,
                expanded: false,
                parent:   tree
            };
            if (j === tree.children.length) {
                num = tree.children.length;
                tree.children.push(obj);
            } else {
                num = j;
                tree.children.splice(num, 0, obj);
            }
            if (addedNodes) {
                addedNodes.push(tree.children[num]);
            }
        }
        if (parts.length - 1 === index) {
            tree.children[num].id = id;
        } else {
            tree.children[num].expanded = tree.children[num].expanded || isExpanded;
            _treeInsert(tree.children[num], parts, id, index + 1, isExpanded, addedNodes, data);
        }
    }

    function showActive($dlg, scrollIntoView)  {
        var data = $dlg.data('selectId');
        // Select current element
        if (data.selectedID) {
            data.$tree.fancytree('getTree').visit(function (node) {
                if (node.key === data.selectedID) {
                    try {
                        node.setActive();
                        node.makeVisible({scrollIntoView: scrollIntoView || false});
                        //$(node).find('table.fancytree-ext-table tbody tr td') //xxx
                    } catch (err) {
                        console.error(err);
                    }
                    return false;
                }
            });
        }
    }

    function syncHeader($dlg) {
        var data = $dlg.data('selectId');
        if (!data) return;
        var $header = $dlg.find('.main-header-table');
        var thDest = $header.find('>tbody>tr>td');	//if table headers are specified in its semantically correct tag, are obtained
        var thSrc = data.$tree.find('>tbody>tr>td');

        var x, o;
        for (var i = 0; i < thDest.length - 1; i++) {
            if ((x = $(thSrc[i]).width())) {
                $(thDest[i]).attr('width', x);
                if ((o = $ (thSrc[i + 1]).offset().left)) {
                    if ((o -= $ (thDest[i + 1]).offset().left)) {
                        $(thDest[i]).attr('width', x + o);
                    }
                }
            }
        }
    }

    function findRoomsForObject(data, id, withParentInfo, rooms) {
        if (!id) {
            return [];
        }
        rooms = rooms || [];
        for (var i = 0; i < data.roomEnums.length; i++) {
            var common = data.objects[data.roomEnums[i]] && data.objects[data.roomEnums[i]].common;
            var name = common.name;
            if (typeof name === 'object') {
                name = name[systemLang] || name.en;
            }

            if (common.members && common.members.indexOf(id) !== -1 && rooms.indexOf(name) === -1) {
                if (!withParentInfo) {
                    rooms.push(name);
                } else {
                    rooms.push({name: name, origin: id});
                }
            }
        }
        var parts = id.split('.');
        parts.pop();
        id = parts.join('.');
        if (data.objects[id]) findRoomsForObject(data, id, withParentInfo, rooms);

        return rooms;
    }

    function findRoomsForObjectAsIds(data, id, rooms) {
        if (!id) {
            return [];
        }
        rooms = rooms || [];
        for (var i = 0; i < data.roomEnums.length; i++) {
            var common = data.objects[data.roomEnums[i]] && data.objects[data.roomEnums[i]].common;
            if (common && common.members && common.members.indexOf(id) !== -1 &&
                rooms.indexOf(data.roomEnums[i]) === -1) {
                rooms.push(data.roomEnums[i]);
            }
        }
        return rooms;
    }

    function findFunctionsForObject(data, id, withParentInfo, funcs) {
        if (!id) {
            return [];
        }
        funcs = funcs || [];
        for (var i = 0; i < data.funcEnums.length; i++) {
            var common = data.objects[data.funcEnums[i]] && data.objects[data.funcEnums[i]].common;
            var name = common.name;
            if (typeof name === 'object') {
                name = name[systemLang] || name.en;
            }
            if (common && common.members && common.members.indexOf(id) !== -1 && funcs.indexOf(name) === -1) {
                if (!withParentInfo) {
                    funcs.push(name);
                } else {
                    funcs.push({name: name, origin: id});
                }
            }
        }
        var parts = id.split('.');
        parts.pop();
        id = parts.join('.');
        if (data.objects[id]) findFunctionsForObject(data, id, withParentInfo, funcs);

        return funcs;
    }

    function findFunctionsForObjectAsIds(data, id, funcs) {
        if (!id) {
            return [];
        }
        funcs = funcs || [];
        for (var i = 0; i < data.funcEnums.length; i++) {
            var common = data.objects[data.funcEnums[i]] && data.objects[data.funcEnums[i]].common;
            if (common && common.members && common.members.indexOf(id) !== -1 &&
                funcs.indexOf(data.funcEnums[i]) === -1) {
                funcs.push(data.funcEnums[i]);
            }
        }

        return funcs;
    }

    function clippyCopy(e) {
        var $temp = $('<input>');
        //$('body').append($temp);
        $(this).append($temp);
        $temp.val($(this).parent().data('clippy')).select();
        document.execCommand('copy');
        $temp.remove();
        e.preventDefault();
        e.stopPropagation();
    }

    function editValueDialog() {
        var data = $(this).data('data');
        var $parent = $(this).parent();
        var value = $parent.data('clippy');
        var id = $parent.data('id');
        $('<div position: absolute;left: 5px; top: 5px; right: 5px; bottom: 5px; border: 1px solid #CCC;"><textarea style="margin: 0; border: 0;background: white;width: 100%; height: 100%; resize: none;" ></textarea></div>')
            .dialog({
                autoOpen: true,
                modal: true,
                title: data.texts.edit,
                width: '50%',
                height: 200,
                open: function (event) {
                    $(this).find('textarea').val(value);
                    $(event.target).parent().find('.ui-dialog-titlebar-close .ui-button-text').html('');
                },
                buttons: [
                    {
                        text: data.texts.select,
                        click: function () {
                            var val = $(this).find('textarea').val();
                            if (val !== value) {
                                data.quickEditCallback(id, 'value', val, value);
                                value = '<span style="color: darkviolet; width: 100%;">' + value + '</span>';
                                $parent.html(value);
                            }
                            $(this).dialog('close').dialog('destroy').remove();
                        }
                    },
                    {
                        text: data.texts.cancel,
                        click: function () {
                            $(this).dialog('close').dialog('destroy').remove();
                        }
                    }
                ]
            });
    }

    function clippyShow(e) {
        var text;
        var data;
        if ($(this).hasClass('clippy') && !$(this).find('.clippy-button').length) {
            data = data || $(this).data('data');
            text = '<button class="clippy-button ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only td-button" ' +
                'role="button" title="' + data.texts.copyToClipboard + '" ' +
                //'style="position: absolute; right: 0; top: 0; width: 36px; height: 18px;z-index: 1">' +
                'style="position: absolute; right: 0; top: 0; z-index: 1; margin-top: 1px;">' +
                '<span class="ui-button-icon-primary ui-icon ui-icon-clipboard" ></span></button>';

            $(this).append(text);
            $(this).find('.clippy-button').click(clippyCopy);
        }

        if ($(this).hasClass('edit-dialog') && !$(this).find('.edit-dialog-button').length) {
            data = data || $(this).data('data');
            text = '<button class="edit-dialog-button ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only td-button" ' +
                'role="button" title="' + data.texts.editDialog + '" ' +
                //'style="position: absolute; right: 0; top: 0; width: 36px; height: 18px;z-index: 1">' +
                'style="position: absolute; right: 22px; top: 0; z-index: 1; margin-top: 1px;">' +
                '<span class="ui-button-icon-primary ui-icon ui-icon-pencil"></span></button>';
            $(this).append(text);
            $(this).find('.edit-dialog-button').click(editValueDialog).data('data', data);
        }
    }

    function clippyHide(e) {
        $(this).find('.clippy-button').remove();
        $(this).find('.edit-dialog-button').remove();
    }

    function installColResize(data, $dlg) {
        if (data.noColumnResize || !$.fn.colResizable) return;

        var data = $dlg.data('selectId');
        if (!data) return;
        if (data.$tree.is(':visible')) {
            data.$tree.colResizable({
                liveDrag:       true,
                //resizeMode:   'flex',
                resizeMode:     'fit',
                minWidth:       50,

                partialRefresh: true,
                marginLeft:     5,
                postbackSafe:   true,

                onResize: function (event) {
                    syncHeader($dlg);
                }
            });
            syncHeader($dlg);
        } else {
            setTimeout(function () {
                installColResize(data, $dlg);
            }, 400)
        }
    }

    function getStates(data, id) {
        var states;
        if (data.objects[id] &&
            data.objects[id].common &&
            data.objects[id].common.states) {
            states = data.objects[id].common.states;
        }
        if (states) {
            if (typeof states === 'string' && states[0] === '{') {
                try {
                    states = JSON.parse(states);
                } catch (ex) {
                    console.error('Cannot parse states: ' + states);
                    states = null;
                }
            } else
            // if odl format val1:text1;val2:text2
            if (typeof states === 'string') {
                var parts = states.split(';');
                states = {};
                for (var p = 0; p < parts.length; p++) {
                    var s = parts[p].split(':');
                    states[s[0]] = s[1];
                }
            }
        }
        return states;
    }

    function setFilterVal(data, field, val) {
        if (!field) return;
        data.$dlg.find('.filter[data-index="' + field + '"]').val(val).trigger('change');
    }

    function onQuickEditField(event) {
        var $this   = $(this);
        var id      = $this.data('id');
        var attr    = $this.data('name');
        var data    = $this.data('selectId');
        var type    = $this.data('type');
        var $parent = $(event.currentTarget).parent();
        // actually $parent === $thisParent, but I dont know
        var $thisParent = $this.parent();
        var clippy  = $thisParent.hasClass('clippy');
        var editDialog = $thisParent.hasClass('edit-dialog');
        var options = $this.data('options');
        var oldVal  = $this.data('old-value');
        var states  = null;
        //var activeNode = $(this).fancytree('getTree').getActiveNode();

        if (clippy)  {
            $thisParent.removeClass('clippy');
            $thisParent.find('.clippy-button').remove(); // delete clippy buttons because they overlay the edit field
        }
        if (editDialog) {
            $thisParent.removeClass('edit-dialog');
            $thisParent.find('.edit-dialog-button').remove(); // delete edit buttons because they overlay the edit field
        }
        $thisParent.css({overflow: 'visible'});
        $this.unbind('click').removeClass('select-id-quick-edit').css('position', 'relative');

        type = type === 'boolean' ? 'checkbox' : 'text';
        var text;
        var editType = type;

        switch (attr) {
            case 'value':
                states = getStates(data, id);
                if (states) {
                    text = '<select style="width: calc(100% - 50px); z-index: 2">';
                    for (var s in states) {
                        if (!states.hasOwnProperty(s) || typeof states[s] !== 'string') continue;
                        text += '<option value="' + s + '">' + states[s] + '</option>';
                    }
                    text += '</select>';
                    editType = 'select';
                }
                break;
            case 'room':
                states = findRoomsForObjectAsIds (data, id) || [];
                text = '<select style="width: calc(100% - 50px); z-index: 2" multiple="multiple">';
                for (var ee = 0; ee < data.roomEnums.length; ee++) {
                    var room = data.objects[data.roomEnums[ee]];
                    var rName;
                    if (room && room.common && room.common.name) {
                        rName = room.common.name;
                        if (typeof rName === 'object') {
                            rName = rName[systemLang] || rName.en;
                        }
                    } else {
                        rName = data.roomEnums[ee].split('.').pop();
                    }

                    text += '<option value="' + data.roomEnums[ee] + '" ' + (states.indexOf(data.roomEnums[ee]) !== -1 ? 'selected' : '') + '>' + rName + '</option>';
                }
                text += '</select>';
                editType = 'select';
                break;
            case 'function':
                states = findFunctionsForObjectAsIds (data, id) || [];
                text = '<select style="width: calc(100% - 50px); z-index: 2" multiple="multiple">';
                for (var e = 0; e < data.funcEnums.length; e++) {
                    var func = data.objects[data.funcEnums[e]];
                    var fName;
                    if (func && func.common && func.common.name) {
                        fName = func.common.name;
                        if (typeof fName === 'object') {
                            fName = fName[systemLang] || fName.en;
                        }
                    } else {
                        fName = data.funcEnums[e].split('.').pop();
                    }
                    text += '<option value="' + data.funcEnums[e] + '" ' + (states.indexOf(data.funcEnums[e]) !== -1 ? 'selected' : '') + '>' + fName + '</option>';
                }
                text += '</select>';
                editType = 'select';
                break;
            default: if (options) {
                if (typeof options === 'function') {
                    states = options(id, attr);
                } else {
                    states = options;
                }
                if (states) {
                    text = '<select style="width: calc(100% - 50px); z-index: 2">';
                    for (var t in states) {
                        if (states.hasOwnProperty(t)) {
                            text += '<option value="' + t + '">' + states[t] + '</option>';
                        }
                    }
                    text += '</select>';
                    editType = 'select';
                } else if (states === false) {
                    return;
                }
            }
        }

        text = text || '<input style="z-index: 2" type="' + type + '"' + (type !== 'checkbox' ? 'class="objects-inline-edit"' : '') + '/>';

        var timeout = null;

        if (attr === 'room' || attr === 'function' || attr === 'role') {
            editType = 'select';
        }

        $this.html(text +
            '<div class="select-id-quick-edit-buttons ' + editType + '"><div class="ui-icon ui-icon-check select-id-quick-edit-ok"></div>' +
            '<div class="cancel ui-icon ui-icon-close select-id-quick-edit-cancel" title="' + data.texts.cancel + '"></div></div>');

        var oldLeftPadding = $this.css('padding-left');
        var oldWidth = $this.css('width');
        var isTitleEdit = $this.is('.objects-name-coll-title');
        $this.css({'padding-left': 2, width: isTitleEdit ? 'calc(100% - 28px)' : 'calc(100% - 0px)'});

        var $input = (attr === 'function' || attr === 'room' || states) ? $this.find('select') : $this.find('input');

        if (attr === 'room' || attr === 'function') {
            $input.multiselect({
                autoOpen: true,
                close: function () {
                    $input.trigger('blur');
                }
            });
        } else if (attr === 'role')  {
            $input.autocomplete({
                minLength: 0,
                source: data.roles
            }).on('focus', function () {
                $(this).autocomplete('search', '');
            });
        }

        if (editType === 'select') {
            if ($input.width() > $this.width() - 34) {
                var x = Math.max($input.width() - ($this.width() - 34), 34);
                $input.css({'padding-right': x});
            }
        }
        function editDone(ot) {
            if (ot === undefined) ot = $this.data('old-value') || '';
            if (clippy) {
                $thisParent.addClass('clippy');
            }
            if (editDialog) {
                $thisParent.addClass('edit-dialog');
            }
            $thisParent.css({overflow: 'hidden'});
            $this.css({'padding-left': oldLeftPadding});
            if (!oldWidth) {
                $this.removeAttr('width');
            } else {
                $this.attr('width', oldWidth);
            }
            $this.html(ot).click(onQuickEditField).addClass('select-id-quick-edit');
            //if (activeNode && activeNode.lebgth) activeNode.setActive();
            setTimeout(function() {
                //$(event.currentTarget).parent().trigger('click'); // re-select the line so we can continue using the keyboard
                $parent.trigger('click'); // re-select the line so we can continue using the keyboard
            }, 50);
            //$(event.currentTarget).parent().focus().select();
        }

        function handleCancel(e) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            e.preventDefault();
            e.stopPropagation();
            // var old = $this.data('old-value');
            editDone();
        }

        $this.find('.select-id-quick-edit-cancel').click(handleCancel);

        $this.find('.select-id-quick-edit-ok').click(function ()  {
            var _$input = (attr === 'function' || attr === 'room' || states) ? $this.find('select') : $this.find('input');
            _$input.trigger('blur');
        });

        if (type === 'checkbox') {
            $input.prop('checked', oldVal);
        } else {
            if (attr !== 'room' && attr !== 'function') {
                $input.val(oldVal);
            }
        }

        $input.blur(function () {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(function () {
                var _oldText = $this.data('old-value');
                var val = $(this).attr('type') === 'checkbox' ? $(this).prop('checked') : $(this).val();
                if ((attr === 'room' || attr === 'function') && !val) {
                    val = [];
                }

                if (attr === 'value' || JSON.stringify(val) !== JSON.stringify(_oldText)) {
                    data.quickEditCallback(id, attr, val, _oldText);
                    _oldText = '<span style="color: darkviolet; width: 100%;">' + _oldText + '</span>';
                }
                editDone(_oldText);
            }.bind(this), 100);
        }).keyup(function (e) {
            if (e.which === 13) $(this).trigger('blur');
            if (e.which === 27) {
                handleCancel(e);
            }
        });

        if (typeof event === 'object') {
            event.preventDefault();
            event.stopPropagation();
        }

        setTimeout(function () {
            $input.focus();//.select();
        }, 100);
    }

    function quality2text(q) {
        if (!q) return 'ok';
        var custom = q & 0xFFFF0000;
        var text = '';
        if (q & 0x40) text += 'device';
        if (q & 0x80) text += 'sensor';
        if (q & 0x01) text += ' bad';
        if (q & 0x02) text += ' not connected';
        if (q & 0x04) text += ' error';

        return text + (custom ? '|0x' + (custom >> 16).toString(16).toUpperCase() : '') + ' [0x' + q.toString(16).toUpperCase() + ']';
    }

    function forEachColumn (data, cb) {
        for (var c = 0; c < data.columns.length; c++) {
            var name = data.columns[c];
            if (typeof name === 'object') {
                if (name.hasOwnProperty('name')) {
                    name = name.name;
                } else if (name.hasOwnProperty('en')) {
                    name = name[systemLang] || name.en;
                }
            }
            cb (name, c);
        }
    }

    function initTreeDialog($dlg) {
        var c;
        $dlg.addClass('dialog-select-object-ids');
        if ($dlg.attr('id') !== 'dialog-select-member' && $dlg.attr('id') !== 'dialog-select-members') {
            $dlg.css({height: '100%', width: '100%'});
        } else {
            $dlg.css({height: 'calc(100% - 110px)', width: '100%'});
        }
        var data = $dlg.data('selectId');
        if (!data) return;
        if (data.columns && data.columns[0] !== 'ID') {
            data.columns.unshift('ID');
            if (data.widths) data.widths.unshift('200px');
        }

        removeImageFromSettings (data);
        //var noStates = (data.objects && !data.states);
        var multiselect = (!data.noDialog && !data.noMultiselect);

        // load expert mode flag
        if (typeof Storage !== 'undefined' && data.name && data.expertModeRegEx) {
            data.expertMode = window.localStorage.getItem(data.name + '-expert');
            data.expertMode = (data.expertMode === true || data.expertMode === 'true');
        }
        if (typeof Storage !== 'undefined' && data.name) { //} && data.sort) {
            data.sort = window.localStorage.getItem(data.name + '-sort');
            data.sort = (data.sort === true || data.sort === 'true');
        }

        // Get all states
        var expandeds = getExpandeds(data);
        getAllStates(data);

        if (!data.noDialog && !data.buttonsDlg) {
            data.buttonsDlg = [
                {
                    id:     'button-ok',
                    text:   data.texts.select,
                    click:  function () {
                        var _data = $dlg.data('selectId');
                        if (_data && _data.onSuccess) _data.onSuccess(_data.selectedID, _data.currentId, _data.objects[_data.selectedID]);
                        _data.currentId = _data.selectedID;
                        storeSettings(data);
                        $dlg.dialog('close');
                    }
                },
                {
                    text:   data.texts.cancel,
                    click:  function () {
                        storeSettings(data);
                        $(this).dialog('close');
                    }
                }
            ];

            $dlg.dialog ({
                autoOpen: false,
                modal: true,
                width: '90%',
                open: function (event) {
                    $(event.target).parent().find('.ui-dialog-titlebar-close .ui-button-text').html('');
                },
                close: function () {
                    storeSettings (data);
                },
                height: 500,
                buttons: data.buttonsDlg
            });
            if (data.zindex !== null) {
                $ ('div[aria-describedby="' + $dlg.attr ('id') + '"]').css ({'z-index': data.zindex})
            }
        }

        var filter = {};
        forEachColumn(data, function (name) {
            filter[name] = $dlg.find('.filter[data-index="' + name + '"]').val();
        });

        function getComboBoxEnums(kind) {
            var i, ret = [];
            switch (kind) {
                case 'room':
                    for (i = 0; i < data.roomEnums.length; i++) {
                        ret.push(getName(data.objects[data.roomEnums[i]], data.roomEnums[i]));
                    }
                    // if (data.rooms) delete data.rooms;
                    // if (data.roomsColored) delete data.roomsColored;
                    return ret;
                case 'function':
                    for (i = 0; i < data.funcEnums.length; i++) {
                        ret.push(getName(data.objects[data.funcEnums[i]], data.funcEnums[i]));
                    }
                    // if (data.funcs) delete data.funcs;
                    // if (data.funcsColored) delete data.funcsColored;
                    return ret;
                case 'role':
                    for (var j = 0; j < data.roles.length; j++) {
                        ret.push(data.roles[j]);
                    }
                    return ret;
                case 'type':
                    for (var k = 0; k < data.types.length; k++) {
                        ret.push(data.types[k]);
                    }
                    return ret;
                case 'button':
                    ret.push([data.texts.all, '']);
                    ret.push([data.texts.with, 'true']);
                    ret.push([data.texts.without, 'false']);
                    for (var h = 0; h < data.histories.length; h++) {
                        ret.push(data.histories[h]);
                    }
                    return ret;
            }
            return ret;
        }

        // toolbar buttons
        var tds = 
            '<td><button class="ui-button-icon-only panel-button btn-refresh"></button></td>' +
            '<td><button class="panel-button btn-list"></button></td>' +
            '<td><button class="panel-button btn-collapse"></button></td>'  +
            '<td><button class="panel-button btn-expand"></button></td>' +
            '<td class="select-id-custom-buttons"></td>';
        if (data.filter && data.filter.type === 'state' && multiselect) {
            tds += 
                '<td style="padding-left: 10px"><button class="panel-button btn-select-all"></button></td>' +
                '<td><button class="panel-button btn-unselect-all"></button></td>' +
                '<td><button class="panel-button btn-invert-selection"></button></td>';
        }
        if (data.expertModeRegEx) {
            tds += '<td style="padding-left: 10px"><button class="panel-button btn-expert"></button></td>';
        }
        tds += '<td><button class="panel-button btn-sort"></button></td>';

        if (data.panelButtons) {
            tds += '<td class="iob-toolbar-sep"></td>';
            for (c = 0; c < data.panelButtons.length; c++) {
                tds += '<td><button class="panel-button btn-custom-' + c + '"></button></td>';
            }
        }

        if (data.useHistory) {
            tds += '<td style="padding-left: 10px"><button class="panel-button btn-history"></button></td>';
        }

        var text = 
            '<div class="dialog-select-container" style="width: 100%; height: 100%">' +
            '<table class="main-toolbar-table">' +
            '    <tr>' + tds + '<td style="width: 100%;"></td>' +
            '    </tr>' +
            '</table>' +
            '<table class="main-header-table">'
        ;

        function textFilterText(filterNo, placeholder) {
            if (placeholder === undefined) {
                placeholder = data.texts[filterNo.toLowerCase()] || '';
            }
            return  '<table class="main-header-input-table">' +
                    '    <tbody>' +
                    '       <tr>' +
                    '           <td class="input">' +
                    '               <input  data-index="' + filterNo + '" placeholder="' + placeholder + '" class="filter">' +
                    '           </td>' +
                    '           <td>' +
                    '               <button data-index="' + filterNo + '" class="filter-btn"></button>' +
                    '           </td>' +
                    '       </tr>' +
                    '    </tbody>' +
                    '</table>';
        }

        function textCombobox(filterNo, placeholder) {
            var txt = '';
            if (data.columns.indexOf (filterNo) !== -1) {
                if (placeholder === undefined) placeholder = data.texts[filterNo.toLowerCase()] || '';
                var cbEntries = getComboBoxEnums(filterNo);
                var cbText = '<select data-index="' + filterNo + '" class="filter">';

                var add = function (a, b) {
                    if (Array.isArray(a)) {
                        b = a[0];
                        a = a[1]
                    } else if (b === undefined) {
                        b = a;
                    }
                    cbText += '<option value="' + a + '">' + b + '</option>';
                };
                if (typeof addAll2FilterCombobox !== 'undefined' && addAll2FilterCombobox) {
                    add('', placeholder + ' (' + data.texts.all + ')');
                } else {
                    add('', placeholder);
                }
                for (var i = 0, len = cbEntries.length; i < len; i++) {
                    add (cbEntries[i]);
                }
                cbText += '</select>';

                txt = '' +
                    //'<table style="width: 100%;padding: 0;border: 1px solid #c0c0c0;border-spacing: 0;border-radius: 2px;">' +
                    '<table class="main-header-input-table">' +
                    '        <tbody>' +
                    '        <tr>' +
                    '            <td class="input">';
                txt += cbText;
                txt += '' +
                    '            </td>' +
                    '            <td>' +
                    '                <button data-index="' + filterNo + '" class="filter-btn"></button>' +
                    '            </td>' +
                    '        </tr>' +
                    '        </tbody>' +
                    '    </table>';
            } else {
                if (filterNo === 'room') {
                    if (data.rooms) delete data.rooms;
                    if (data.roomsColored) delete data.roomsColored;
                } else if (filterNo === 'function') {
                    if (data.funcs) delete data.funcs;
                    if (data.funcsColored) delete data.funcsColored;
                }
            }
            return txt;
        }

        function detectStates(node, patterns) {
            if (node && node.children) {
                var hasStates = false;
                var someExpanded = false;
                for (var c = 0; c < node.children.length; c++) {
                    if (!node.children[c].expanded) {
                        if (data.objects[node.children[c].data.id] && data.objects[node.children[c].data.id].type === 'state') {
                            hasStates = true;
                            break;
                        }
                    } else {
                        someExpanded = true;
                    }
                }
                if (hasStates) {
                    patterns.push(node.data.id || node.key);
                } else if (someExpanded) {
                    for (var cc = 0; cc < node.children.length; cc++) {
                        if (node.children[cc].expanded) {
                            detectStates(node.children[cc], patterns);
                        }
                    }
                }
            }
        }

        text += '        <tbody>';
        text += '            <tr>'; //<td></td>';

        forEachColumn(data, function(name) {
            text += '<td>';
            // we may not search by value
            if (name === 'ID' || name === 'name' || name === 'enum') {
                text += textFilterText(name);
            } else if (name === 'type' || name === 'role' || name === 'room' || name === 'function') {
                text += textCombobox(name);
            } else if (name === 'button') {
                if (data.customButtonFilter) {
                    text += textCombobox(name);
                } else {
                    //if (name === 'buttons' || name === 'button') {
                        text += '<span style="padding-left: ' + lineIndent + '"></span>';
                    // } else {
                    //     text += '<table class="main-header-input-table"><tbody><tr><td style="padding-left: ' + lineIndent + '">' + _(name) + '</td></tr></tbody></table>';
                    // }
                }
            } else {
                text += '<span style="padding-left: ' + lineIndent + '">' + _(name) + '</span>';
            }
            text += '</td>';
        });

        text += '               </tr>';
        text += '        </tbody>';
        text += '    </table>';

        text += '<div class="' + (data.buttons ? 'grid-main-wh-div' : 'grid-main-wob-div') + '">';
        text += ' <table class="iob-list-font objects-list-table" cellspacing="0" cellpadding="0">';
        text += '        <colgroup>';

        var thead = '<thead class="grid-objects-head"><tr>';


        var widths = {ID: data.firstMinWidth ? data.firstMinWidth : '20%', name: '20%', type: '6%', role: '10%', room: '10%', 'function': '10%', value: '10%', button: '9%', enum: '2%'};

        forEachColumn(data, function(name, i) {
            var w = data.widths ? data.widths[i] : widths[name] || '2%';
            text += '<col width="' + w + '"/>';
            thead += '<th style="width: ' + w + ';"></th>';
        });

        text += '        </colgroup>';
        text += thead + '</tr></thead>';

        text += '        <tbody>';
        text += '        </tbody>';
        text += '    </table></div>' +
            '<div class="objects-list-running" style="display: none;">' + data.texts.wait + '</div>' +
            '</div>'
        ;

        function addClippyToElement($elem, key, objectId) {
            if (!data.noCopyToClipboard) {
                $elem.addClass('clippy' + (objectId ? ' edit-dialog' : ''));

                if (key !== undefined) {
                    $elem.data('clippy', key);
                }

                if (objectId) {
                    $elem.data('id', objectId);
                }

                $elem.css ({position: 'relative'})
                    .data('data', data)
                    .mouseenter(clippyShow)
                    .mouseleave(clippyHide);
            }
        }

        $dlg.html(text);

        data.$tree = $dlg.find('.objects-list-table');
        data.$tree[0]._onChange = data.onSuccess || data.onChange;

        var foptions = {
            titlesTabbable: true,     // Add all node titles to TAB chain
            quicksearch:    true,

            ///////////////////////////

            //autoScroll: true,

            ///////////////////////////////////////////

            source:         data.tree.children,
            extensions:     ['table', 'gridnav', 'filter', 'themeroller'],

            themeroller: {
                addClass: '',  // no rounded corners
                selectedClass: 'iob-state-active'
            },

            checkbox:       multiselect,
            table: {
                //indentation: 20,
                indentation: 9,
                nodeColumnIdx: 0
            },
            gridnav: {
                autofocusInput:   false,
                handleCursorKeys: true
            },
            filter: {
                mode: 'hide',
                autoApply: true
            },

            // keydown: function(event, data){
            //     var KC = $.ui.keyCode;
            //
            //     if( $(event.originalEvent.target).is(':input') ){
            //
            //         // When inside an input, let the control handle the keys
            //         data.result = 'preventNav';
            //
            //         // But do the tree navigation on Ctrl + NAV_KEY
            //         switch( event.which ){
            //             case KC.LEFT:
            //             case KC.RIGHT:
            //             case KC.BACKSPACE:
            //             case KC.SPACE:
            //                 if( e.shiftKey ){
            //                     data.node.navigate(event.which);
            //                 }
            //         }
            //     }
            // },


            activate: function (event, data) {
                // A node was activated: display its title:
                // On change
                if (!multiselect) {
                    var _data = $dlg.data('selectId');
                    var newId = data.node.key;

                    if (_data.onChange) _data.onChange(newId, _data.selectedID, _data.objects[newId]);

                    _data.selectedID = newId;
                    if (!_data.noDialog) {
                        // Set title of dialog box
                        $dlg.dialog('option', 'title', _data.texts.selectid + ' - ' + getName(_data.objects[newId], newId));

                        // Enable/ disable 'Select' button
                        if (_data.objects[newId]) { // && _data.objects[newId].type === 'state') {
                            $dlg.find('#button-ok').removeClass('ui-state-disabled');
                        } else {
                            $dlg.find('#button-ok').addClass('ui-state-disabled');
                        }

                    }
                }
            },
            select: function (event, data) {
                var _data = $dlg.data('selectId');
                var newIds = [];
                var selectedNodes = data.tree.getSelectedNodes();
                for	(var i = 0; i < selectedNodes.length; i++) {
                    newIds.push(selectedNodes[i].key);
                }

                if (_data.onChange) {
                    _data.onChange(newIds, _data.selectedID);
                }

                _data.selectedID = newIds;

                // Enable/ disable 'Select' button
                if (newIds.length > 0) {
                    $dlg.find('#button-ok').removeClass('ui-state-disabled');
                } else {
                    $dlg.find('#button-ok').addClass('ui-state-disabled');
                }
            },
            renderColumns: function (event, _data) {
                var node = _data.node;
                var key = node.key;
                var obj = data.objects[key];

                var $tr     = $(node.tr);
                var $tdList = $tr.find('>td');

                var isCommon = obj && obj.common;
                var $firstTD = $tdList.eq(0);
                $firstTD.css({'overflow': 'hidden'});
                var cnt = countChildren(key, data);

                if (isCommon && obj.type) {
                    $tr.addClass('fancytree-type-' + obj.type + (data.draggable && data.draggable.indexOf(obj.type) !== -1 ? ' fancytree-type-draggable' : ' fancytree-type-not-draggable'));
                    if (data.draggable && data.draggable.indexOf(obj.type) === -1) {
                        $tr.attr('data-nodrag', 'true');
                    }
                } else {
                    $tr.attr('data-nodrag', 'true');
                }
                $tr.attr('data-id', key);

                // Show number of all children as small grey number
                var $cnt = $firstTD.find('.select-id-cnt');
                // If node has some children
                if (cnt) {
                    if ($cnt.length) {
                        // modify it if span yet exists
                        $cnt.text('#' + cnt);
                    } else {
                        // create new span
                        $firstTD.append('<span class="select-id-cnt">#' + cnt + '</span>');
                    }
                } else {
                    // remove this span, because object may be was updated
                    $cnt.remove();
                }

                var base = 0;

                // hide checkbox if only states should be selected
                if (data.filter && data.filter.type === 'state' && (!obj || obj.type !== 'state')) {
                    $firstTD.find('.fancytree-checkbox').hide();
                }

                // special case for javascript scripts
                if (obj && (key.match(/^script\.js\./) || key.match(/^enum\.[\w\d_-]+$/))) {
                    if (obj.type !== 'script') {
                        // force folder icon and change color
                        if (node.key !== 'script.js.global') {
                            $firstTD.find('.fancytree-title').css({'font-weight': 'bold', color: '#000080'});
                        } else {
                            $firstTD.find('.fancytree-title').css({'font-weight': 'bold', color: '#078a0c'});
                        }
                        $firstTD.addClass('fancytree-force-folder');
                    }
                }

                if (!data.noCopyToClipboard) {
                    addClippyToElement($firstTD, node.key);
                }

                if (data.useNameAsId) {
                    $firstTD.find('.fancytree-title').html(getName(obj, key));
                }

                function getIcon() {
                    var icon = '';
                    var alt  = '';
                    var _id_ = 'system.adapter.' + key;
                    if (data.objects[_id_] && data.objects[_id_].common && data.objects[_id_].common.icon) {
                        // if not BASE64
                        if (!data.objects[_id_].common.icon.match(/^data:image\//)) {
                            if (data.objects[_id_].common.icon.indexOf('.') !== -1) {
                                icon = '/adapter/' + data.objects[_id_].common.name + '/' + data.objects[_id_].common.icon;
                            } else {
                                return '<i class="material-icons iob-list-icon">' + data.objects[_id_].common.icon + '</i>';
                            }
                        } else {
                            icon = data.objects[_id_].common.icon;
                        }
                    } else
                    if (isCommon) {
                        if (obj.common.icon) {
                            if (!obj.common.icon.match(/^data:image\//)) {
                                if (obj.common.icon.indexOf('.') !== -1) {
                                    var instance;
                                    if (obj.type === 'instance') {
                                        icon = '/adapter/' + obj.common.name + '/' + obj.common.icon;
                                    } else if (node.key.match(/^system\.adapter\./)) {
                                        instance = node.key.split('.', 3);
                                        if (obj.common.icon[0] === '/') {
                                            instance[2] += obj.common.icon;
                                        } else {
                                            instance[2] += '/' + obj.common.icon;
                                        }
                                        icon = '/adapter/' + instance[2];
                                    } else {
                                        instance = key.split('.', 2);
                                        if (obj.common.icon[0] === '/') {
                                            instance[0] += obj.common.icon;
                                        } else {
                                            instance[0] += '/' + obj.common.icon;
                                        }
                                        icon = '/adapter/' + instance[0];
                                    }
                                } else {
                                    return '<i class="material-icons iob-list-icon">' + obj.common.icon + '</i>';
                                }
                            } else {
                                // base 64 image
                                icon = obj.common.icon;
                            }
                        } else if (obj.type === 'device') {
                            icon = data.imgPath + 'device.png';
                            alt  = 'device';
                        } else if (obj.type === 'channel') {
                            icon = data.imgPath + 'channel.png';
                            alt  = 'channel';
                        } else if (obj.type === 'state') {
                            icon = data.imgPath + 'state.png';
                            alt  = 'state';
                        }
                    }

                    if (icon) return '<img class="iob-list-icon" src="' + icon + '" alt="' + alt + '"/>';
                    return ''
                }

                var $elem;
                var val;
                for (var c = 0; c < data.columns.length; c++) {
                    var name = data.columns[c];
                    $elem = $tdList.eq(base);

                    var setText = function (txt) {
                        $elem.html(span(txt));
                    };

                    if (typeof name === 'object') {
                        if (name.hasOwnProperty('name')) {
                            name = name.name;
                        } else {
                            name = name[systemLang] || name.en;
                        }
                    }

                    switch (name) {
                        case 'id':
                        case 'ID':
                            break;
                        case 'name':
                            var icon = getIcon();
                            //$elem = $tdList.eq(base);
                            var t = isCommon ? (obj.common.name || '') : '';
                            if (typeof t === 'object') {
                                t = t[systemLang] || t.en;
                            }

                            $elem.html('<span style="padding-left: ' + (icon ? lineIndent : 0) + '; height: 100%; width: 100%">' +
                                (icon ? '<span class="objects-name-coll-icon" style="vertical-align: middle">' + icon + '</span>' : '') +
                                '<div class="objects-name-coll-title iob-ellipsis" style="border:0;">' + t + '</div>' +
                                '</span>');


                            var $e = $elem.find('.objects-name-coll-title');
                            if (!t) $e.css({'vertical-align': 'middle'});

                            $e.attr('title', t);
                            if (data.quickEdit /*&& obj*/ && data.quickEdit.indexOf('name') !== -1) {

                                $e.data('old-value', t);
                                $e.click(onQuickEditField).data('id', node.key).data('name', 'name').data('selectId', data).addClass('select-id-quick-edit');
                            }
                            break;
                        case 'type':
                            setText(obj ? obj.type || '' : '');
                            break;
                        case 'role':
                            val = isCommon ? obj.common.role || '' : '';
                            setText(val);

                            if (data.quickEdit && obj && data.quickEdit.indexOf ('role') !== -1) {
                                $elem.data ('old-value', val);
                                $elem.click (onQuickEditField).data ('id', node.key).data ('name', 'role').data ('selectId', data).addClass ('select-id-quick-edit');
                            }
                            break;
                        case 'room':
                            // Try to find room
                            if (data.roomsColored) {
                                var room = data.roomsColored[node.key];
                                if (!room) room = data.roomsColored[node.key] = findRoomsForObject (data, node.key, true);
                                val = room.map (function (e) {
                                    if (typeof e.name === 'object') {
                                        return e.name[systemLang] || e.name.en;
                                    } else {
                                        return e.name;
                                    }
                                }).join (', ');
                                if (room.length && room[0].origin !== node.key) {
                                    $elem.css ({color: 'gray'}).attr ('title', room[0].origin);
                                } else {
                                    $elem.css ({color: 'inherit'}).attr ('title', null);
                                }
                            } else {
                                val = '';
                            }
                            setText(val);

                            if (data.quickEdit && data.objects[node.key] && data.quickEdit.indexOf ('room') !== -1) {
                                $elem.data ('old-value', val);
                                $elem.click (onQuickEditField)
                                    .data ('id', node.key)
                                    .data ('name', 'room')
                                    .data ('selectId', data)
                                    .addClass ('select-id-quick-edit');
                            }
                            break;
                        case 'function':
                            // Try to find function
                            if (data.funcsColored) {
                                if (!data.funcsColored[node.key]) data.funcsColored[node.key] = findFunctionsForObject (data, node.key, true);
                                val = data.funcsColored[node.key].map (function (e) {
                                    if (typeof e.name === 'object') {
                                        return e.name[systemLang] || e.name.en;
                                    } else {
                                        return e.name;
                                    }
                                }).join (', ');
                                if (data.funcsColored[node.key].length && data.funcsColored[node.key][0].origin !== node.key) {
                                    $elem.css ({color: 'gray'}).attr ('title', data.funcsColored[node.key][0].origin);
                                } else {
                                    $elem.css ({color: 'inherit'}).attr ('title', null);
                                }
                            } else {
                                val = '';
                            }
                            setText(val);

                            if (data.quickEdit && data.objects[node.key] && data.quickEdit.indexOf ('function') !== -1) {
                                $elem.data ('old-value', val);
                                $elem.click (onQuickEditField)
                                    .data ('id', node.key)
                                    .data ('name', 'function')
                                    .data ('selectId', data)
                                    .addClass ('select-id-quick-edit');
                            }
                            break;
                        case 'value':
                            var common = obj ? obj.common || {} : {};

                            var state;
                            if (data.states && ((state = data.states[node.key]) || data.states[node.key + '.val'] !== undefined)) {
                                //var $elem = $tdList.eq(base);
                                var states = getStates (data, node.key);
                                if (!state) {
                                    state = {
                                        val: data.states[node.key + '.val'],
                                        ts: data.states[node.key + '.ts'],
                                        lc: data.states[node.key + '.lc'],
                                        from: data.states[node.key + '.from'],
                                        ack: (data.states[node.key + '.ack'] === undefined) ? '' : data.states[node.key + '.ack'],
                                        q: (data.states[node.key + '.q'] === undefined) ? 0 : data.states[node.key + '.q']
                                    };
                                } else {
                                    state = Object.assign ({}, state);
                                }

                                if (common.role === 'value.time') {
                                    state.val = state.val ? (new Date (state.val)).toString () : state.val;
                                }
                                if (states && states[state.val] !== undefined) {
                                    state.val = states[state.val] + '(' + state.val + ')';
                                }

                                var fullVal;
                                if (state.val === undefined) {
                                    state.val = '';
                                } else {
                                    // if less 2000.01.01 00:00:00
                                    if (state.ts < 946681200000) state.ts *= 1000;
                                    if (state.lc < 946681200000) state.lc *= 1000;

                                    if (isCommon && common.unit) state.val += ' ' + common.unit;
                                    fullVal = data.texts.value + ': ' + state.val;
                                    fullVal += '\x0A' + data.texts.ack + ': ' + state.ack;
                                    fullVal += '\x0A' + data.texts.ts + ': ' + (state.ts ? formatDate (new Date (state.ts)) : '');
                                    fullVal += '\x0A' + data.texts.lc + ': ' + (state.lc ? formatDate (new Date (state.lc)) : '');
                                    fullVal += '\x0A' + data.texts.from + ': ' + (state.from || '');
                                    fullVal += '\x0A' + data.texts.quality + ': ' + quality2text (state.q || 0);
                                }

                                $elem.html ('<span class="highlight" style="display: inline-block; width: 100%; padding-left: ' + lineIndent + ';">' + state.val + '</span>')
                                    .attr ('title', fullVal)
                                    .css ({position: 'relative'});
                                var $span = $elem.find('span');
                                $span.css({color: state.ack ? (state.q ? 'orange' : '') : '#c00000'});

                                if (obj && obj.type === 'state' && common.type !== 'file') {
                                    addClippyToElement($elem, state.val,
                                        obj &&
                                        obj.type === 'state' &&
                                        (data.expertMode || obj.common.write !== false) ? key : undefined);
                                }
                            } else {
                                $elem.text ('')
                                    .attr ('title', '')
                                    .removeClass ('clippy');
                            }
                            $elem.dblclick (function (e) {
                                e.preventDefault ();
                            });

                            if (data.quickEdit &&
                                obj &&
                                obj.type === 'state' &&
                                data.quickEdit.indexOf ('value') !== -1 &&
                                (data.expertMode || obj.common.write !== false)
                            ) {
                                if (obj.common.role === 'button' && !data.expertMode) {
                                    $elem.html ('<button data-id="' + node.key + '" class="select-button-push"></button>');
                                } else if (!obj.common || obj.common.type !== 'file') {
                                    var val_ = data.states[node.key];
                                    val_ = val_ ? val_.val : '';
                                    var $span_ = $elem.find('span');
                                    $span_.data ('old-value', val_).data ('type', common.type || typeof val_);

                                    //$elem.click (onQuickEditField)    //!!!xxx
                                    $span_.click (onQuickEditField)    //!!!xxx
                                        .data ('id', node.key)
                                        .data ('name', 'value')
                                        .data ('selectId', data)
                                        .addClass ('select-id-quick-edit');
                                }

                                $tr.find('.select-button-push[data-id="' + node.key + '"]').button({
                                    text: false,
                                    icons: {
                                        primary: 'ui-icon-arrowthickstop-1-s'
                                    }
                                }).click (function () {
                                    var id = $ (this).data ('id');
                                    data.quickEditCallback (id, 'value', true);
                                }).attr ('title', data.texts.push).css ({width: 26, height: 20});
                            }

                            if (common.type === 'file') {
                                data.webServer = data.webServer || (window.location.protocol + '//' + window.location.hostname + ':8082');

                                // link
                                $elem.html ('<a href="' + data.webServer + '/state/' + node.key + '" target="_blank">' + data.webServer + '/state/' + node.key + '</a>')
                                    .attr ('title', data.texts.linkToFile);
                            }

                            break;
                        case 'button':
                            // Show buttons
                            var text;
                            if (data.buttons) {
                                if (obj || data.showButtonsForNotExistingObjects) {
                                    text = '';
                                    if (data.editEnd) {
                                        text += '' +
                                            '<button data-id="' + node.key + '" class="select-button-edit"></button>' +
                                            '<button data-id="' + node.key + '" class="select-button-ok"></button>' +
                                            '<button data-id="' + node.key + '" class="select-button-cancel"></button>';
                                    }

                                    for (var j = 0; j < data.buttons.length; j++) {
                                        text += '<button data-id="' + node.key + '" class="select-button-' + j + ' select-button-custom td-button"></button>';
                                    }

                                    setText(text);

                                    for (var p = 0; p < data.buttons.length; p++) {
                                        var $btn = $tr.find('.select-button-' + p + '[data-id="' + node.key + '"]').button(data.buttons[p]).click(function () {
                                            var cb = $(this).data('callback');
                                            if (cb) cb.call($(this), $(this).data('id'));
                                        }).data('callback', data.buttons[p].click).attr('title', data.buttons[p].title || '');
                                        if ($btn.length === 0) continue;
                                        if (data.buttons[p].width)  $btn.css({width: data.buttons[p].width});
                                        if (data.buttons[p].height) $btn.css({height: data.buttons[p].height});
                                        if (data.buttons[p].match)  data.buttons[p].match.call($btn, node.key);
                                    }
                                } else {
                                    $elem.text('');
                                }
                            } else if (data.editEnd) {
                                text = '<button data-id="' + node.key + '" class="select-button-edit"></button>' +
                                    '<button data-id="' + node.key + '" class="select-button-ok"></button>' +
                                    '<button data-id="' + node.key + '" class="select-button-cancel"></button>';
                            }

                            if (data.editEnd) {
                                $tr.find ('.select-button-edit[data-id="' + node.key + '"]').button({
                                    text: false,
                                    icons: {
                                        primary: 'ui-icon-pencil'
                                    }
                                }).click (function () {
                                    $ (this).data ('node').editStart ();
                                }).attr ('title', data.texts.edit).data ('node', node).css ({width: 26, height: 20});

                                $tr.find ('.select-button-ok[data-id="' + node.key + '"]').button({
                                    text: false,
                                    icons: {
                                        primary: 'ui-icon-check'
                                    }
                                }).click (function () {
                                    var node = $ (this).data ('node');
                                    node.editFinished = true;
                                    node.editEnd (true);
                                }).attr ('title', data.texts.ok).data ('node', node).hide ().css({
                                    width: 26,
                                    height: 20
                                });

                                $tr.find('.select-button-cancel[data-id="' + node.key + '"]').button({
                                    text: false,
                                    icons: {
                                        primary: 'ui-icon-close'
                                    }
                                }).click(function () {
                                    var node = $ (this).data ('node');
                                    node.editFinished = true;
                                    node.editEnd (false);
                                }).attr('title', data.texts.cancel).data('node', node).hide().css({
                                    width: 26,
                                    height: 20
                                });
                            }
                            break;
                        case 'enum':
                            if (isCommon && obj.common.members && obj.common.members.length > 0) {
                                var te;
                                if (obj.common.members.length < 4) {
                                    te =  '#' + obj.common.members.length + ' ' + obj.common.members.join (', ');
                                } else {
                                    te = '#' + obj.common.members.length;
                                }
                                $elem.html('<div class="iob-ellipsis">' + te + '</div>');
                                $elem.attr ('title', obj.common.members.join ('\x0A'));
                            } else {
                                $elem.text ('');
                                $elem.attr ('title', '');
                            }
                            break;
                        default:
                            if (typeof data.columns[c].data === 'function') {
                                //$elem = $tdList.eq(base);
                                var val = data.columns[c].data (node.key, data.columns[c].name);
                                var title = '';
                                if (data.columns[c].title) title = data.columns[c].title (node.key, data.columns[c].name);
                                $elem.html (val).attr ('title', title);
                                if (data.quickEdit && data.objects[node.key]) {
                                    for (var q = 0; q < data.quickEdit.length; q++) {
                                        if (data.quickEdit[q] === data.columns[c].name ||
                                            data.quickEdit[q].name === data.columns[c].name) {
                                            $elem.data ('old-value', val).data ('type', typeof val);

                                            $elem.click (onQuickEditField)
                                                .data ('id', node.key)
                                                .data ('name', data.columns[c].name)
                                                .data ('selectId', data)
                                                .data ('options', data.quickEdit[q].options)
                                                .addClass ('select-id-quick-edit');

                                            break;
                                        }
                                    }
                                }
                            }
                            break;
                    }
                    ///
                    base++;
                    ///
                }
            },
            dblclick: function (event, _data) {
                if (data.buttonsDlg && !data.quickEditCallback) {
                    if (_data && _data.node && !_data.node.folder) {
                        data.buttonsDlg[0].click();
                    }
                } else if (data.dblclick) {
                    var tree = data.$tree.fancytree('getTree');

                    var node = tree.getActiveNode();
                    if (node) {
                        data.dblclick(node.key);
                    }
                }
            },
            expand: function (event, _data) {
                if (data.expandedCallback) {
                    if (_data && _data.node) {
                        var childrenCount = 0;
                        var hasStates = false;
                        var patterns  = [];
                        if (_data.node.children) {
                            childrenCount = _data.node.children.length;
                            detectStates(_data.node, patterns);
                            if (patterns.length) hasStates = true;
                        }

                        if (!patterns.length) {
                            patterns.push(_data.node.key);
                        }

                        data.expandedCallback(patterns, childrenCount, hasStates);
                    }
                }
            },
            collapse: function (event, _data) {
                if (data.collapsedCallback) {
                    if (_data && _data.node) {
                        data.collapsedCallback(_data.node.key);
                    }
                }

            }
        };

        if (data.editEnd) {
            foptions.extensions.push('edit');
            foptions.edit = {
                triggerStart: ['f2', 'dblclick', 'shift+click', 'mac+enter'],
                triggerStop:  ['esc'],
                beforeEdit: function (event, _data) {
                    // Return false to prevent edit mode
                    if (!data.objects[_data.node.key]) return false;
                },
                edit: function (event, _data) {
                    $dlg.find('.select-button-edit[data-id="'   + _data.node.key + '"]').hide();
                    $dlg.find('.select-button-cancel[data-id="' + _data.node.key + '"]').show();
                    $dlg.find('.select-button-ok[data-id="'     + _data.node.key + '"]').show();
                    $dlg.find('.select-button-custom[data-id="' + _data.node.key + '"]').hide();

                    var node = _data.node;
                    var $tdList = $(node.tr).find('>td');
                    // Editor was opened (available as data.input)
                    var inputs = {id: _data.input};

                    forEachColumn(data, function(name, c) {
                        if (name === 'name') {
                            inputs[name] = $('<input type="text" data-name="' + name + '" class="select-edit" value="' + data.objects[_data.node.key].common[name] + '" style="width: 100%"/>');
                            $tdList.eq(c).html(inputs[name]);
                        }
                    });

                    for (var i in inputs) {
                        inputs[i].keyup(function (e) {
                            var node;
                            if (e.which === 13) {
                                // end edit
                                node = $(this).data('node');
                                node.editFinished = true;
                                node.editEnd(true);
                            } else if (e.which === 27) {
                                // end edit
                                node = $(this).data('node');
                                node.editFinished = true;
                                node.editEnd(false);
                            }
                        }).data('node', node);
                    }

                    if (data.editStart) data.editStart(_data.node.key, inputs);
                    node.editFinished = false;
                },
                beforeClose: function (event, _data) {
                    // Return false to prevent cancel/save (data.input is available)
                    return _data.node.editFinished;
                },
                save: function (event, _data) {
                    var editValues = {id: _data.input.val()};

                    forEachColumn (data, function(name) {
                        if (name === 'name') {
                            editValues[name] = $dlg.find('.select-edit[data-name="' + name + '"]').val();
                        }
                    });

                    // Save data.input.val() or return false to keep editor open
                    if (data.editEnd) data.editEnd(_data.node.key, editValues);
                    _data.node.render(true);

                    // We return true, so ext-edit will set the current user input
                    // as title
                    return true;
                },
                close: function (event, _data) {
                    $dlg.find('.select-button-edit[data-id="' + _data.node.key + '"]').show();
                    $dlg.find('.select-button-cancel[data-id="' + _data.node.key + '"]').hide();
                    $dlg.find('.select-button-ok[data-id="' + _data.node.key + '"]').hide();
                    $dlg.find('.select-button-custom[data-id="' + _data.node.key + '"]').show();
                    if (_data.node.editFinished !== undefined) delete _data.node.editFinished;
                    // Editor was removed
                    if (data.save) {
                        // Since we started an async request, mark the node as preliminary
                        $(data.node.span).addClass('pending');
                    }
                }
            };
        }

        data.$tree.fancytree(foptions).on('nodeCommand', function (event, data) {
            // Custom event handler that is triggered by keydown-handler and
            // context menu:
            var refNode;
            var tree = $(this).fancytree('getTree');
            var node = tree.getActiveNode();

            switch (data.cmd) {
                case 'moveUp':
                    node.moveTo(node.getPrevSibling(), 'before');
                    node.setActive();
                    break;
                case 'moveDown':
                    node.moveTo(node.getNextSibling(), 'after');
                    node.setActive();
                    break;
                case 'indent':
                    refNode = node.getPrevSibling();
                    node.moveTo(refNode, 'child');
                    refNode.setExpanded();
                    node.setActive();
                    break;
                case 'outdent':
                    node.moveTo(node.getParent(), 'after');
                    node.setActive();
                    break;
                case 'delete':
                    var button = $(node.tr).find('.select-button-1');
                    if (button && button.length) {
                        button.trigger('click');
                    }
                    break;
                case 'rename':
                    var e = $(node.tr).find('.objects-name-coll-title');
                    if (e && e.length) {
                        e.trigger('click');
                    }
                    break;

                /*case 'copy':
                    CLIPBOARD = {
                        mode: data.cmd,
                        data: node.toDict(function (n) {
                            delete n.key;
                        })
                    };
                    break;
                case 'clear':
                    CLIPBOARD = null;
                    break;*/
                default:
                    alert('Unhandled command: ' + data.cmd);
                    return;
            }

        }).on('keydown', function (e) {
            var c   = String.fromCharCode(e.which);
            var cmd = null;

            if (e.ctrlKey) {
                switch (e.which) {
                    case 'c':
                        cmd = 'copy';
                        break;
                    case $.ui.keyCode.UP:
                        cmd = 'moveUp';
                        break;
                    case $.ui.keyCode.DOWN:
                        cmd = 'moveDown';
                        break;
                    case $.ui.keyCode.RIGHT:
                        cmd = 'indent';
                        break;
                    case $.ui.keyCode.LEFT:
                        cmd = 'outdent';
                        break;
                }
            } else {
                switch (e.which) {
                    case $.ui.keyCode.DELETE:
                        cmd = 'delete';
                        break;
                    case 113: // F2
                        cmd = 'rename';
                        break;
                }
            }
            if (cmd) {
                $(this).trigger('nodeCommand', {cmd: cmd});
                return false;
            }
        });

        function customFilter(node) {
            if (node.parent && node.parent.match) return true;

            // Read all filter settings
            if (data.filterVals === null) {
                data.filterVals = {length: 0};
                var value;

                forEachColumn (data, function (name) {
                    //if (name === 'image') return;
                    value = $dlg.find('.filter[data-index="' + name + '"]').val();
                    if (name !== 'role' && name !== 'type' && name !== 'room' && name !== 'function' && value) {
                        value = value.toLowerCase();
                    }
                    if (value) {
                        data.filterVals[name] = value;
                        data.filterVals.length++;
                    }
                });

                // if no clear "close" event => store on change
                if (data.noDialog) storeSettings(data);
            }

            var obj = data.objects[node.key];
            var isCommon = obj && obj.common;

            for (var f in data.filterVals) {
                //if (f === 'length') continue;
                //if (isCommon === null) isCommon = obj && obj.common;

                switch (f) {
                    case 'length':
                        continue;
                    case 'ID':
                        if (node.key.toLowerCase ().indexOf (data.filterVals[f]) === -1) return false;
                        break;
                    case 'name':
                    case 'enum':
                        if (!isCommon || obj.common[f] === undefined || obj.common[f].toLowerCase ().indexOf (data.filterVals[f]) === -1) return false;
                        break;
                    case 'role':
                        if (data.roleExactly) {
                            if (!isCommon || obj.common[f] === undefined || obj.common[f] !== data.filterVals[f]) return false;
                        } else {
                            if (!isCommon || obj.common[f] === undefined || obj.common[f].indexOf (data.filterVals[f]) === -1) return false;
                        }
                        break;
                    case 'type':
                        if (!obj || obj[f] === undefined || obj[f] !== data.filterVals[f]) return false;
                        break;
                    case 'value':
                        if (!data.states[node.key] || data.states[node.key].val === undefined || data.states[node.key].val === null || data.states[node.key].val.toString ().toLowerCase ().indexOf (data.filterVals[f]) === -1) return false;
                        break;
                    case 'button':
                        if (data.filterVals[f] === 'true') {
                            if (!isCommon || !obj.common.custom || obj.common.custom.enabled === false) return false;
                        } else if (data.filterVals[f] === 'false') {
                            if (!isCommon || obj.type !== 'state' || obj.common.custom) return false;
                        } else if (data.filterVals[f]) {
                            if (!isCommon || !obj.common.custom || !obj.common.custom[data.filterVals[f]]) return false;
                        }
                        break;
                    case 'room':
                        if (!obj || !data.rooms) return false;

                        // Try to find room
                        if (!data.rooms[node.key]) data.rooms[node.key] = findRoomsForObject (data, node.key);
                        if (data.rooms[node.key].indexOf (data.filterVals[f]) === -1) return false;
                        break;
                    case 'function':
                        if (!obj || !data.funcs) return false;

                        // Try to find functions
                        if (!data.funcs[node.key]) data.funcs[node.key] = findFunctionsForObject (data, node.key);
                        if (data.funcs[node.key].indexOf (data.filterVals[f]) === -1) return false;
                        break;
                }
            }
            return true;
        }

        restoreExpandeds(data, expandeds);
        var resizeTimer;
        $(window).resize(function (/* x, y */) {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(syncHeader.bind(null, $dlg), 100);
        });
        $dlg.trigger('resize');

        var changeTimer;

        $dlg.find('.filter').change(function (event) {
            data.filterVals = null;
            if (changeTimer) clearTimeout(changeTimer);
            //changeTimer = setTimeout(function() {
            if (event && event.target) {
                filterChanged(event.target);
            }

            var $ee = $dlg.find('.objects-list-running');
            $ee.show ();
            data.$tree.fancytree ('getTree').filterNodes (customFilter, false);
            $ee.hide ();
            //}, 0);
        }).keyup(function () {
            var tree = data.$tree[0];
            if (tree._timer) tree._timer = clearTimeout(tree._timer);

            var that = this;
            tree._timer = setTimeout(function () {
                $(that).trigger('change');
            }, 200);
        });

        $dlg.find('.filter-btn').button({icons: {primary: 'ui-icon-close'}, text: false}).click(function () {
            $dlg.find('.filter[data-index="' + $(this).data('index') + '"]').val('').trigger('change');  //filter buttons action
        });

        $dlg.find('.btn-collapse').button({icons: {primary: 'ui-icon-folder-collapsed'}, text: false}).click(function () {
            $dlg.find('.objects-list-running').show();
            setTimeout(function () {
                data.$tree.fancytree('getRootNode').visit(function (node) {
                    if (!data.filterVals.length || node.match || node.subMatch) node.setExpanded(false);
                });
                $dlg.find('.objects-list-running').hide();
            }, 100);
        }).attr('title', data.texts.collapse);

        $dlg.find('.btn-expand').button({icons: {primary: 'ui-icon-folder-open'}, text: false}).click(function () {
            $dlg.find('.objects-list-running').show();
            setTimeout(function () {
                data.$tree.fancytree('getRootNode').visit(function (node) {
                    if (!data.filterVals.length || node.match || node.subMatch)
                        node.setExpanded(true);
                });
                $dlg.find('.objects-list-running').hide();
            }, 100);
        }).attr('title', data.texts.expand);

        $dlg.find('.btn-list').button({icons: {primary: 'ui-icon-grip-dotted-horizontal'}, text: false}).click(function () {
            $dlg.find('.objects-list-running').show();
            data.list = !data.list;
            if (data.list) {
                $dlg.find('.btn-list').addClass('ui-state-error');
                $dlg.find('.btn-collapse').hide();
                $(this).attr('title', data.texts.list);
            } else {
                $dlg.find('.btn-list').removeClass('ui-state-error');
                $dlg.find('.btn-expand').show();
                $dlg.find('.btn-collapse').show();
                $(this).attr('title', data.texts.tree);
            }
            $dlg.find('.objects-list-running').show();
            setTimeout(function () {
                data.inited = false;
                initTreeDialog(data.$dlg);
                $dlg.find('.objects-list-running').hide();
            }, 200);
        }).attr('title', data.texts.tree);

        if (data.list) {
            $dlg.find('.btn-list')
                .addClass('ui-state-error')
                .attr('title', data.texts.list);
            $dlg.find('.btn-expand').hide();
            $dlg.find('.btn-collapse').hide();
        }

        $dlg.find('.btn-refresh').button({icons: {primary: 'ui-icon-refresh'}, text: false}).click(function () {
            $dlg.find('.objects-list-running').show();
            setTimeout(function () {
                data.inited = false;
                // request all objects anew on refresh
                if (data.getObjects) {
                    data.getObjects(function (err, objs) {
                        data.objects = objs;
                        initTreeDialog(data.$dlg, false);
                        $dlg.find('.objects-list-running').hide();
                    });
                } else {
                    initTreeDialog(data.$dlg, false);
                    $dlg.find('.objects-list-running').hide();
                }
            }, 100);
        }).attr('title', data.texts.refresh);

        $dlg.find('.btn-sort').button({icons: {primary: 'ui-icon-bookmark'}, text: false})/*.css({width: 18, height: 18})*/.click(function () {
            $dlg.find('.objects-list-running').show();

            data.sort = !data.sort;
            if (data.sort) {
                $dlg.find('.btn-sort').addClass('ui-state-error');
            } else {
                $dlg.find('.btn-sort').removeClass('ui-state-error');
            }
            storeSettings(data, true);

            setTimeout(function () {
                data.inited = false;
                sortTree(data);
                $dlg.find('.objects-list-running').hide();
            }, 100);
        }).attr('title', data.texts.sort);
        if (data.sort) $dlg.find('.btn-sort').addClass('ui-state-error');

        $dlg.find('.btn-history').button({icons: {primary: 'ui-icon-gear'}, text: false}).click(function () {
            $dlg.find('.objects-list-running').show();

            setTimeout(function () {
                data.customButtonFilter.callback();
                $dlg.find('.objects-list-running').hide();
            }, 1);
        }).attr('title', data.texts.history);

        $dlg.find('.btn-select-all').button({icons: {primary: 'ui-icon-circle-check'}, text: false}).click(function () {
            $dlg.find('.objects-list-running').show();
            setTimeout(function () {
                data.$tree.fancytree('getRootNode').visit(function (node) {
                    if (!data.filterVals.length || node.match || node.subMatch) {
                        // hide checkbox if only states should be selected
                        if (data.objects[node.key] && data.objects[node.key].type === 'state') {
                            node.setSelected(true);
                        }
                    }
                });
                $dlg.find('.objects-list-running').hide();
            }, 100);
        }).attr('title', data.texts.selectAll);

        if (data.expertModeRegEx) {
            $dlg.find('.btn-expert').button({icons: {primary: 'ui-icon-person'}, text: false}).click(function () {
                $dlg.find('.objects-list-running').show();

                data.expertMode = !data.expertMode;
                if (data.expertMode) {
                    $dlg.find('.btn-expert').addClass('ui-state-error');
                } else {
                    $dlg.find('.btn-expert').removeClass('ui-state-error');
                }
                storeSettings(data, true);

                setTimeout(function () {
                    data.inited = false;
                    initTreeDialog(data.$dlg);
                    $dlg.find('.objects-list-running').hide();
                }, 200);
            }).attr('title', data.texts.expertMode);

            if (data.expertMode) $dlg.find('.btn-expert').addClass('ui-state-error');
        }

        $dlg.find('.btn-unselectall').button({icons: {primary: 'ui-icon-circle-close'}, text: false}).click(function () {
            $dlg.find('.objects-list-running').show();
            setTimeout(function () {
                data.$tree.fancytree('getRootNode').visit(function (node) {
                    node.setSelected(false);
                });
                $dlg.find('.objects-list-running').hide();
            }, 100);
        }).attr('title', data.texts.unselectAll);

        $dlg.find('.btn-invert-selection').button({icons: {primary: 'ui-icon-transferthick-e-w'}, text: false}).click(function () {
            $dlg.find('.objects-list-running').show();
            setTimeout(function () {
                data.$tree.fancytree('getRootNode').visit(function (node) {
                    if (!data.filterVals.length || node.match || node.subMatch){
                        if (data.objects[node.key] && data.objects[node.key].type === 'state') {
                            node.toggleSelected();
                        }
                    }
                });
                $dlg.find('.objects-list-running').hide();
            }, 100);
        }).attr('title', data.texts.invertSelection);

        for (var f in filter) {
            try {
                if (f) setFilterVal(data, f, filter[f]);
            } catch (err) {
                console.error('Cannot apply filter: ' + err)
            }
        }

        if (data.panelButtons) {
            for (var z = 0; z < data.panelButtons.length; z++) {
                $dlg.find('.btn-custom-' + z).button(data.panelButtons[z]).click(data.panelButtons[z].click).attr('title', data.panelButtons[z].title || '');
            }
        }

        /*if (data.useHistory) {
            $dlg.find('.filter_button_' + data.instance + '_btn')
                .button(data.customButtonFilter)
                .click(data.customButtonFilter.callback);
        }*/

        showActive($dlg);
        //loadSettings(data);
        installColResize(data, $dlg);
        loadSettings(data);
        if ($dlg.attr('id') !== 'dialog-select-member' && $dlg.attr('id') !== 'dialog-select-members') {
            setTimeout(function () {
                $dlg.css({height: '100%'}); //xxx
            }, 500);
        } else if ($dlg.attr('id') === 'dialog-select-members') {
            $dlg.find('div:first-child').css({height: 'calc(100% - 50px)'});
        }

        // set preset filters
        for (var field in data.filterPresets) {
            if (!data.filterPresets.hasOwnProperty(field) || !data.filterPresets[field]) continue;
            if (typeof data.filterPresets[field] === 'object') {
                setFilterVal(data, field, data.filterPresets[field][0]);
            } else {
                setFilterVal(data, field, data.filterPresets[field]);
            }
        }
        sortTree(data);
    }

    function storeSettings(data, force) {
        if (typeof Storage === 'undefined' || !data.name) return;

        if (data.timer) clearTimeout(data.timer);

        if (force) {
            window.localStorage.setItem(data.name + '-filter', JSON.stringify(data.filterVals));
            window.localStorage.setItem(data.name + '-expert', JSON.stringify(data.expertMode));
            window.localStorage.setItem(data.name + '-sort', JSON.stringify(data.sort));
            data.timer = null;
        } else {
            data.timer = setTimeout(function () {
                window.localStorage.setItem(data.name + '-filter', JSON.stringify(data.filterVals));
                window.localStorage.setItem(data.name + '-expert', JSON.stringify(data.expertMode));
                window.localStorage.setItem(data.name + '-sort', JSON.stringify(data.sort));
            }, 500);
        }
    }

    function loadSettings(data) {
        if (typeof Storage !== 'undefined' && data.name) {
            var f = window.localStorage.getItem(data.name + '-filter');
            if (f) {
                try{
                    f = JSON.parse(f);
                    removeImageFromSettings(f);
                    //setTimeout(function() {
                    for (var field in f) {
                        if (!f.hasOwnProperty(field) || field === 'length') continue;
                        if (data.filterPresets[field]) continue;
                        setFilterVal(data, field, f[field]);
                    }
                    //}, 0);
                } catch(e) {
                    console.error('Cannot parse settings: ' + e);
                }
            } else if (!data.filter) {
                // set default filter: state
                setFilterVal(data, 'type', 'state');
            }
        }
    }

    function countChildren(id, data) {
        var pos = data.ids.indexOf(id);
        var len = data.ids.length;
        var cnt = 0;
        if (id.indexOf('.') === -1 || (
                data.objects[id] && (data.objects[id].type === 'state' || data.objects[id].type === 'adapter'))) {
            return cnt;
        }
        if (pos === -1) {
            pos = 0;
            while (pos < len && data.ids[pos] < id) {
                pos++;
            }
            pos--;
        }
        if (pos !== -1) {
            pos++;
            while (pos < len && data.ids[pos].startsWith(id + '.')) {
                pos++;
                cnt++;
            }
        }
        return cnt;
    }

    function recalcChildrenCounters(node, data) {
        var id  = node.key;
        var $tr = $(node.tr);
        var $firstTD = $tr.find('>td').eq(0);
        var cnt = countChildren(id, data);
        if (cnt) {
            var $cnt = $firstTD.find('.select-id-cnt');
            if ($cnt.length) {
                $cnt.text('#' + cnt);
            } else {
                //$firstTD.append('<span class="select-id-cnt" style="position: absolute; top: 6px; right: 1px; font-size: smaller; color: lightslategray">#' + cnt + '</span>');
                $firstTD.append('<span class="select-id-cnt">#' + cnt + '</span>');
            }
        } else {
            $firstTD.find('.select-id-cnt').remove();
        }
        if (node.children && node.children.length) {
            for (var c = 0; c < node.children.length; c++) {
                recalcChildrenCounters(node.children[c], data);
            }
        }
    }

    var methods = {
        init: function (options) {
            // done, just to show possible settings, this is not required
            var settings = $.extend({
                currentId:  '',
                objects:    null,
                states:     null,
                filter:     null,
                imgPath:    'lib/css/fancytree/',
                connCfg:    null,
                onSuccess:  null,
                onChange:   null,
                zindex:     null,
                list:       false,
                name:       null,
                sortConfig:       {
                    statesFirst:     true,
                    ignoreSortOrder: false
                },
                //columns: ['image', 'name', 'type', 'role', 'enum', 'room', 'function', 'value', 'button']
                columns: ['name', 'type', 'role', 'enum', 'room', 'function', 'value', 'button']
            }, options);

            settings.texts = settings.texts || {};
            settings.texts = $.extend({
                select:   'Select',
                cancel:   'Cancel',
                all:      'All',
                id:       'ID',
                name:     'Name',
                role:     'Role',
                type:     'Type',
                room:     'Room',
                'function': 'Function',
                enum:     'Members',
                value:    'Value',
                selectid: 'Select ID',
                from:     'From',
                quality:  'Quality',
                lc:       'Last changed',
                ts:       'Time stamp',
                ack:      'Acknowledged',
                expand:   'Expand all nodes',
                collapse: 'Collapse all nodes',
                refresh:  'Rebuild tree',
                edit:     'Edit',
                ok:       'Ok',
                push:     'Trigger event',
                wait:     'Processing...',
                list:     'Show list view',
                tree:     'Show tree view',
                selectAll: 'Select all',
                unselectAll: 'Unselect all',
                invertSelection: 'Invert selection',
                copyToClipboard: 'Copy to clipboard'
            }, settings.texts);

            var that = this;
            for (var i = 0; i < this.length; i++) {
                var dlg = this[i];
                var $dlg = $(dlg);
                var data = $dlg.data('selectId');
                // Init data
                if (!data) {
                    data = {
                        tree:               {title: '', children: [], count: 0, root: true},
                        roomEnums:          [],
                        rooms:              {},
                        roomsColored:       {},
                        funcEnums:          [],
                        funcs:              {},
                        funcsColored:       {},
                        roles:              [],
                        histories:          [],
                        types:              [],
                        regexSystemAdapter: new RegExp('^system\\.adapter\\.'),
                        regexSystemHost:    new RegExp('^system\\.host\\.'),
                        regexEnumRooms:     new RegExp('^enum\\.rooms\\.'),
                        regexEnumFuncs:     new RegExp('^enum\\.functions\\.'),
                        inited:             false,
                        filterPresets:      {}
                    };
                    $dlg.data('selectId', data);
                }
                if (data.inited) {
                    // Re-init tree if filter or selectedID changed
                    if ((data.filter && !settings.filter && settings.filter !== undefined) ||
                        (!data.filter && settings.filter) ||
                        (data.filter && settings.filter && JSON.stringify(data.filter) !== JSON.stringify(settings.filter))) {
                        data.inited = false;
                    }
                    if (data.inited && settings.currentId !== undefined && (data.currentId !== settings.currentId)) {
                        // Deactivate current line
                        var tree = data.$tree.fancytree('getTree');
                        tree.visit(function (node) {
                            if (node.key === data.currentId) {
                                node.setActive(false);
                                return false;
                            }
                        });
                    }
                }

                data = $.extend(data, settings);

                data.rootExp = data.root ? new RegExp('^' + data.root.replace('.', '\\.')) : null;

                data.selectedID = data.currentId;

                // make a copy of filter
                data.filter = JSON.parse(JSON.stringify(data.filter));

                if (!data.objects && data.connCfg) {
                    // Read objects and states
                    data.socketURL = '';
                    data.socketSESSION = '';
                    if (typeof data.connCfg.socketUrl !== 'undefined') {
                        data.socketURL = data.connCfg.socketUrl;
                        if (data.socketURL && data.socketURL[0] === ':') {
                            data.socketURL = location.protocol + '//' + location.hostname + data.socketURL;
                        }
                        data.socketSESSION          = data.connCfg.socketSession;
                        data.socketUPGRADE          = data.connCfg.upgrade;
                        data.socketRememberUpgrade  = data.connCfg.rememberUpgrade;
                        data.socketTransports       = data.connCfg.transports;
                    }

                    var connectTimeout = setTimeout(function () {
                        // noinspection JSJQueryEfficiency
                        var $dlg = $('#select-id-dialog');
                        if (!$dlg.length) {
                            $('body').append('<div id="select-id-dialog"><span class="ui-icon ui-icon-alert"></span><span>' + (data.texts.noconnection || 'No connection to server') + '</span></div>');
                            $dlg = $('#select-id-dialog');
                        }

                        $dlg.dialog({
                            modal: true,
                            open: function (event) {
                                $(event.target).parent().find('.ui-dialog-titlebar-close .ui-button-text').html('');
                            }
                        });
                    }, 5000);

                    data.socket = io.connect(data.socketURL, {
                        query:                          'key=' + data.socketSESSION,
                        'reconnection limit':           10000,
                        'max reconnection attempts':    Infinity,
                        upgrade:                        data.socketUPGRADE,
                        rememberUpgrade:                data.socketRememberUpgrade,
                        transports:                     data.socketTransports
                    });

                    data.socket.on('connect', function () {
                        if (connectTimeout) clearTimeout(connectTimeout);
                        this.emit('name', data.connCfg.socketName || 'selectId');
                        this.emit('getObjects', function (err, res) {
                            data.objects = res;
                            data.socket.emit('getStates', function (err, res) {
                                data.states = res;
                                if (data.readyCallback) {
                                    data.readyCallback(err, data.objects, data.states);
                                }
                            });
                        });
                    });
                    data.socket.on('stateChange', function (id, obj) {
                        that.selectId('state', id, obj);
                    });
                    data.socket.on('objectChange', function (id, obj) {
                        that.selectId('object', id, obj);
                    });
                }

                $dlg.data('selectId', data);
            }

            return this;
        },
        show: function (currentId, filter, onSuccess) {
            if (typeof filter === 'function') {
                onSuccess = filter;
                filter = undefined;
            }
            if (typeof currentId === 'function') {
                onSuccess = currentId;
                currentId = undefined;
            }

            for (var i = 0; i < this.length; i++) {
                var dlg = this[i];
                var $dlg = $(dlg);
                var data = $dlg.data('selectId');
                if (!data) continue;
                if (data.inited) {
                    // Re-init tree if filter or selectedID changed
                    if ((data.filter && !filter && filter !== undefined) ||
                        (!data.filter && filter) ||
                        (data.filter &&  filter && JSON.stringify(data.filter) !== JSON.stringify(filter))) {
                        data.inited = false;
                    }

                    if (data.inited && currentId !== undefined && (data.currentId !== currentId)) {
                        // Deactivate current line
                        var tree_ = data.$tree.fancytree('getTree');
                        tree_.visit(function (node) {
                            if (node.key === data.currentId) {
                                node.setActive(false);
                                return false;
                            }
                        });
                    }
                }
                if (currentId !== undefined) data.currentId = currentId;
                if (filter    !== undefined) data.filter    = JSON.parse(JSON.stringify(filter));
                if (onSuccess !== undefined) {
                    data.onSuccess  = onSuccess;
                    data.$tree = $dlg.find('.objects-list-table');
                    if (data.$tree[0]) data.$tree[0]._onSuccess = data.onSuccess;
                }
                data.selectedID = data.currentId;

                if (!data.inited || !data.noDialog) {
                    data.$dlg = $dlg;
                    initTreeDialog($dlg);
                } else {
                    if (data.selectedID) {
                        var tree__ = data.$tree.fancytree('getTree');
                        tree__.visit(function (node) {
                            if (node.key === data.selectedID) {
                                node.setActive();
                                node.makeVisible({scrollIntoView: false});
                                return false;
                            }
                        });
                    }
                }
                if (!data.noDialog) {
                    $dlg.dialog('option', 'title', data.texts.selectid +  ' - ' + (data.currentId || ' '));
                    if (data.currentId) {
                        $dlg.dialog('option', 'title', data.texts.selectid +  ' - ' + getName(data.objects[data.currentId], data.currentId));
                    } else {
                        $dlg.find('#button-ok').addClass('ui-state-disabled');
                    }

                    $dlg.dialog('open');
                    showActive($dlg, true);
                } else {
                    $dlg.show();
                    showActive($dlg, true);
                }
            }

            return this;
        },
        hide: function () {
            for (var i = 0; i < this.length; i++) {
                var dlg = this[i];
                var $dlg = $(dlg);
                var data = $dlg.data('selectId');
                if (data && !data.noDialog) {
                    $dlg.dialog('hide');
                } else {
                    $dlg.hide();
                }
            }
            return this;
        },
        clear: function () {
            for (var i = 0; i < this.length; i++) {
                var dlg = this[i];
                var $dlg = $(dlg);
                var data = $dlg.data('selectId');
                // Init data
                if (data) {
                    data.tree      = {title: '', children: [], count: 0, root: true};
                    data.rooms     = {};
                    data.roomEnums = [];
                    data.funcs     = {};
                    data.funcEnums = [];
                    data.roles     = [];
                    data.types     = [];
                    data.histories = [];
                }
            }
            return this;
        },
        getInfo: function (id) {
            for (var i = 0; i < this.length; i++) {
                var dlg = this[i];
                var $dlg = $(dlg);
                var data = $dlg.data('selectId');
                if (data && data.objects) {
                    return data.objects[id];
                }
            }
            return null;
        },
        getTreeInfo: function (id) {
            for (var i = 0; i < this.length; i++) {
                var dlg = this[i];
                var $dlg = $(dlg);
                var data = $dlg.data('selectId');
                if (!data || !data.$tree) continue;

                var tree = data.$tree.fancytree('getTree');
                var node = tree && tree.getNodeByKey(id);
                // var node = null;
                // tree.visit(function (n) {
                //     if (n.key === id) {
                //         node = n;
                //         return false;
                //     }
                // });
                var result = {
                    id: id,
                    parent: (node && node.parent && node.parent.parent) ? node.parent.key : null,
                    children: null,
                    obj: data.objects ? data.objects[id] : null
                };
                if (node && node.children) {
                    result.children = [];
                    for (var t = 0; t < node.children.length; t++) {
                        result.children.push(node.children[t].key);
                    }
                    if (!result.children.length) delete result.children;

                }
                return result;
            }
            return null;
        },
        destroy: function () {
            for (var i = 0; i < this.length; i++) {
                var $dlg = $(this[i]);
                var data = $dlg.data('selectId');
                if (data) {
                    $dlg.data('selectId', null);
                    $dlg.find('.dialog-select-container').remove();
                }
            }
            return this;
        },
        reinit: function () {
            for (var i = 0; i < this.length; i++) {
                var dlg = this[i];
                var $dlg = $(dlg);
                var data = $dlg.data('selectId');
                if (data) {
                    data.inited = false;
                    initTreeDialog(data.$dlg);
                }
            }
            return this;
        },
        // update states
        state: function (id, state) {
            for (var i = 0; i < this.length; i++) {
                var dlg  = this[i];
                var $dlg = $(dlg);
                var data = $dlg.data('selectId');
                if (!data || !data.states || !data.$tree) continue;
                if (data.states[id] &&
                    state &&
                    data.states[id].val  === state.val  &&
                    data.states[id].ack  === state.ack  &&
                    data.states[id].q    === state.q    &&
                    data.states[id].from === state.from &&
                    data.states[id].ts   === state.ts
                ) return;

                data.states[id] = state;
                var tree = data.$tree.fancytree('getTree');
                var node = tree.getNodeByKey(id);
                // var node = null;
                // tree.visit(function (n) {
                //     if (n.key === id) {
                //         node = n;
                //         return false;
                //     }
                // });
                if (node) node.render(true);
            }
            return this;
        },
        // update objects
        object: function (id, obj) {
            for (var k = 0, len = this.length; k < len; k++) {
                var dlg = this[k];
                var $dlg = $(dlg);
                var data = $dlg.data('selectId');
                if (!data || !data.$tree || !data.objects) continue;

                if (id.match(/^enum\.rooms/))     {
                    data.rooms = {};
                    data.roomsColored = {};
                }
                if (id.match(/^enum\.functions/)) {
                    data.funcs = {};
                    data.funcsColored = {};
                }

                var tree = data.$tree.fancytree('getTree');
                var node = tree.getNodeByKey(id);
                // var node = null;
                // tree.visit(function (n) {
                //     if (n.key === id) {
                //         node = n;
                //         return false;
                //     }
                // });

                // If new node
                if (!node && obj) {
                    // Filter it

                    data.objects[id] = obj;
                    var addedNodes = [];

                    if (!filterId(data, id)) {
                        return;
                    }
                    // add ID to IDS;
                    if (data.ids.length) {
                        var p = 0;
                        while (data.ids[p] < id) {
                            p++;
                        }
                        data.ids.splice(p, 0, id);
                    }
                    treeInsert(data, id, false, addedNodes);

                    for (var i = 0; i < addedNodes.length; i++) {
                        if (!addedNodes[i].parent.root) {
                            node = tree.getNodeByKey(addedNodes[i].parent.key);
                            // tree.visit(function (n) {
                            //     if (n.key === addedNodes[i].parent.key) {
                            //         node = n;
                            //         return false;
                            //     }
                            // });

                        } else {
                            node = data.$tree.fancytree('getRootNode');
                        }
                        // if no children
                        if (!node.children || !node.children.length) {
                            // add
                            node.addChildren(addedNodes[i]);
                            node.folder = true;
                            node.expanded = false;
                            node.render(true);
                            node.children[0].match = true;
                        } else {
                            var c;
                            for (c = 0; c < node.children.length; c++) {
                                if (node.children[c].key > addedNodes[i].key) break;
                            }
                            // if some found greater than new one
                            if (c !== node.children.length) {
                                node.addChildren(addedNodes[i], node.children[c]);
                                node.children[c].match = true;
                                node.render(true);
                            } else {
                                // just add
                                node.addChildren(addedNodes[i]);
                                node.children[node.children.length - 1].match = true;
                                node.render(true);
                            }
                        }
                    }
                } else if (!obj) {
                    // object deleted
                    delete data.objects[id];
                    deleteTree(data, id);

                    if (data.ids.length) {
                        var pos = data.ids.indexOf(id);
                        if (pos !== -1) {
                            data.ids.splice(pos, 1);
                        }
                    }

                    if (node) {
                        var prev = node.getPrevSibling();
                        var parent = node.parent;
                        node.removeChildren();
                        node.remove();
                        prev && prev.setActive();

                        while (parent && (!parent.children || !parent.children.length)) {
                            var _parent = parent.parent;
                            parent.remove();
                            if (_parent) {
                                _parent.setActive();
                            }
                            parent = _parent;
                        }

                        // recalculate numbers of all children
                        if (data.ids.length) {
                            recalcChildrenCounters(parent, data);
                        }
                        // if (node.children && node.children.length) {
                        //     if (node.children.length === 1) {
                        //         node.folder = false;
                        //         node.expanded = false;
                        //     }
                        //     node.render(true);
                        // } else {
                        //     if (node.parent && node.parent.children.length === 1) {
                        //         node.parent.folder = false;
                        //         node.parent.expanded = false;
                        //         node.parent.render(true);
                        //     }
                        //     node.remove();
                        // }
                    }
                } else {
                    // object updated
                    if (node) {
                        node.render(true);
                    }
                }
            }
            return this;
        },
        option: function (name, value) {
            for (var k = 0; k < this.length; k++) {
                var dlg = this[k];
                var $dlg = $(dlg);
                var data = $dlg.data('selectId');
                if (!data) continue;

                if (data[name] !== undefined) {
                    data[name] = value;
                } else {
                    console.error('Unknown options for selectID: ' + name);
                }
            }
        },
        objectAll: function (id, obj) {
            $('.select-id-dialog-marker').selectId('object', id, obj);
        },
        stateAll: function (id, state) {
            $('.select-id-dialog-marker').selectId('state', id, state);
        },
        getFilteredIds: function () {
            for (var k = 0; k < this.length; k++) {
                var dlg = this[k];
                var $dlg = $(dlg);
                var data = $dlg.data('selectId');
                if (!data || !data.$tree || !data.objects) continue;

                var tree = data.$tree.fancytree('getTree');
                var nodes = [];
                tree.visit(function (n) {
                    if (n.match) {
                        nodes.push(n.key);
                    }
                });
                return nodes;
            }
            return null;
        },
        getActual: function () {
            //for (var k = 0; k < this.length; k++) {
            //
            //}
            var dlg = this[0];
            var $dlg = $(dlg);
            var data = $dlg.data('selectId');
            return data ? data.selectedID : null;
        }
    };

    $.fn.selectId = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method "' +  method + '" not found in jQuery.selectId');
        }
    };
})(jQuery);