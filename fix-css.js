const fs = require('fs');
const path = require('path');

const replacements = {
    'backgroundColor:': 'background-color:',
    'maxWidth:': 'max-width:',
    'maxHeight:': 'max-height:',
    'fontWeight:': 'font-weight:',
    'fontSize:': 'font-size:',
    'borderTop:': 'border-top:',
    'marginBottom:': 'margin-bottom:',
    'borderBottom:': 'border-bottom:',
    'marginTop:': 'margin-top:',
    'marginLeft:': 'margin-left:',
    'marginRight:': 'margin-right:',
    'paddingTop:': 'padding-top:',
    'paddingBottom:': 'padding-bottom:',
    'paddingLeft:': 'padding-left:',
    'paddingRight:': 'padding-right:',
    'textAlign:': 'text-align:',
    'lineHeight:': 'line-height:',
    'letterSpacing:': 'letter-spacing:',
    'objectFit:': 'object-fit:',
    'borderRadius:': 'border-radius:',
    'zIndex:': 'z-index:',
    'gridTemplateColumns:': 'grid-template-columns:',
    'justifyContent:': 'justify-content:',
    'alignItems:': 'align-items:',
    'flexDirection:': 'flex-direction:',
    'boxShadow:': 'box-shadow:',
    'borderColor:': 'border-color:',
    'whiteSpace:': 'white-space:',
    'pointerEvents:': 'pointer-events:',
    'transitionDelay:': 'transition-delay:',
    'backgroundImage:': 'background-image:',
    'backgroundSize:': 'background-size:',
    'backgroundPosition:': 'background-position:',
    'overflowX:': 'overflow-x:',
    'overflowY:': 'overflow-y:',
    'textTransform:': 'text-transform:',
    'listStyle:': 'list-style:',
    'aspectRatio:': 'aspect-ratio:',
    'boxSizing:': 'box-sizing:',
    'gridTemplateRows:': 'grid-template-rows:',
    'rowGap:': 'row-gap:',
    'columnGap:': 'column-gap:',
    'flexWrap:': 'flex-wrap:',
    'minWidth:': 'min-width:',
    'minHeight:': 'min-height:',
    'userSelect:': 'user-select:',
    'backfaceVisibility:': 'backface-visibility:',
    'transformStyle:': 'transform-style:'
};

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const srcDir = path.join(process.cwd(), 'src');

walkDir(srcDir, (filePath) => {
    if (filePath.endsWith('.css')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        for (const [key, value] of Object.entries(replacements)) {
            content = content.replace(new RegExp(key, 'g'), value);
        }
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content);
            console.log(`Fixed: ${filePath}`);
        }
    }
});
