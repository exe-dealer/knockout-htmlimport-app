//var parse5 = require('parse5');
var fs = require('fs');
var Vulcanize = require('vulcanize');
var htmlMinifier = require('html-minifier');
var htmlAutoprefixer = require('html-autoprefixer');

var vulcan = new Vulcanize({
    // stripExcludes: ['template-module.html']
});

vulcan.process('src/bootstrap.html', function (err, inlinedHtml) {
    if (err) {
        return console.error(err);
    }

    inlinedHtml = htmlAutoprefixer.process(inlinedHtml);

    inlinedHtml = htmlMinifier.minify(inlinedHtml, {
        minifyJS: true,
        minifyCSS: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        canCollapseWhitespace: function (tag, attrs) {
            return tag == 'script' && attrs.some(function (attr) {
                return attr.name == 'type' && attr.value == "text/html";
            });
        }
    });

    fs.writeFileSync('dist/app.js', 'document.write(' + JSON.stringify(inlinedHtml) + ');');
    fs.writeFileSync('dist/index.html', fs.readFileSync('src/index.html'));

    // var htmlParser = new parse5.Parser();
    // var htmlSerializer = new parse5.Serializer();
    // var doc = htmlParser.parse(inlinedHtml);
    // rewriteTemplates(doc, htmlSerializer.treeAdapter);
    // console.log(htmlSerializer.serialize(doc));
});
//
// function rewriteTemplates(node, treeAdapter) {
//     var childNodes = treeAdapter.getChildNodes(node);
//     if (childNodes) {
//         for (var i = childNodes.length - 1; i >= 0; i--) {
//             var childNode = childNodes[i];
//             if (treeAdapter.getTagName(childNode) == 'template') {
//                 childNode.tagName = 'script';
//                 childNode.nodeName = 'script';
//                 childNode.attrs.push({
//                     name: 'type',
//                     value: 'text/html'
//                 });
//                 // var id = getAttr(childNode, 'id', treeAdapter);
//                 // var scriptElem = treeAdapter.createElement('script', treeAdapter.getNamespaceURI(node), []);
//                 // treeAdapter.insertText(scriptElem, 'define("' + id + '", function () { return "' + id + '"; })');
//                 // treeAdapter.insertBefore(node, scriptElem, childNode);
//             } else {
//                 rewriteTemplates(childNode, treeAdapter);
//             }
//         }
//     }
//
//     function getAttr(node, attrName, treeAdapter) {
//         return treeAdapter
//             .getAttrList(node)
//             .filter(function (attr) { return attr.name == attrName; })
//             .map(function (attr) { return attr.value; })
//             [0];
//     }
// }

// console.log(html.parse(fs.readFileSync('components/app-tree.html').toString()))
