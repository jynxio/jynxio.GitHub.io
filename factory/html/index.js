const fs = require( "fs" );

const { marked } = require( "marked" );

const { v4: uuidv4 } = require( "uuid" );


let _markdown_content = "";
let _catalog_content = "";
let _h1_content = "";

/**
 * （异步）根据md文件来生成html文件。
 * @param {string} input_path - md文件的路径，比如"./test.md"。
 * @param {string} output_path - html文件的路径，比如"./test.html"。
 * @returns {Promise} - Promise代表是否生成成功。若成功，则返回{success: true, content}对象，生成的html文件将存储在
 * output_path路径下，其中content代表该html文件的内容。该方法暂未处理失败的情况，也不确定失败情况下是否会创建html文件。
 */
function createHtmlFile( input_path, output_path ) {

    return new Promise( resolve => {

        const reader = fs.createReadStream( input_path, { encoding: "utf8" } );

        reader.on( "data", chunk => _markdown_content += chunk );
        reader.on( "end", onEnd );

        function onEnd() {

            marked.use( {

                headerIds: false,

                renderer: {

                    hr: parseHr,

                    heading: parseH123456,

                    checkbox: parseCheckboxInput,

                    listitem: parseLi,

                },

            } );

            const article_content = marked.parse( _markdown_content );

            const html_content = `
                <!DOCTYPE html>
                <html lang="zh-CN">
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>${ _h1_content }</title>
                        <link rel="stylesheet" href="/style/all/resize.css">
                        <link rel="stylesheet" href="/style/all/font.css">
                        <link rel="stylesheet" href="/style/page/page.css">
                    </head>
                    <body>
                        <section id="sidebar">
                            <nav class="home-button">
                                <p>HOMEPAGE</p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="3" viewBox="0 0 24 3" fill="none" stroke="currentColor" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="23.5 0.5, 0.5 0.5, 2.5 2.5"></polyline></svg>
                            </nav>
                            <nav class="catalog-content">
                                <p>IN THIS ARTICLE</p>
                                ${ _catalog_content }
                            </nav>
                        </section>
                        <section id="topbar">
                            <nav class="home-button">
                                <button>HOMEPAGE</button>
                            </nav>
                        </section>
                        <article>${ article_content }</article>
                        <script src="/style/page/page.js"></script>
                    </body>
                </html>
            `;

            fs.writeFile( output_path, html_content, _ => {} );

            _markdown_content = _catalog_content = _h1_content = "";

            resolve( { success: true, content: html_content } );

        }

    } );

}

function parseHr() {

    return "";

}

function parseH123456( content, level ) {

    /* 若Typora设置了图床地址，则会注入下述内容的h2，该语句旨在于剔除该h2。 */
    if ( content.search( /typora-root-url:/ ) > -1 ) return "";

    /* 处理h1。 */
    if ( level === 1 ) {

        const h = `<h1>${ content }</h1>`;

        const p = `<p id="last-updated">Last Updated: ${ getDate() }</p>`;

        _h1_content = content;

        return ( h + p );

    }

    /* 处理h23456。 */
    const id = uuidv4();

    const p = `<p data-level="${ level - 1 }"><a href="#${ id }">${ content }</a></p>`;

    const h = `<h${ level } id="${ id }">${ content }</h${ level }>`;

    _catalog_content += p;

    return h;

}

function parseCheckboxInput( is_checked ) {

    const id = uuidv4();

    const checked_property = is_checked ? "checked" : "";

    const icon_circle = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    const icon_square = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`;

    return `<input id=${ id } ${ checked_property } type="checkbox"><label for=${ id }>${ icon_square }</label>`;

}

function parseLi( content, is_checkbox, is_checked ) {

    const li = is_checkbox ? `<li class="check-li">${ content }</li>` : `<li>${ content }</li>`;

    return li;

}

/**
 * 获取当前时刻的日期。
 * @returns {string} - 当前时刻的日期字符串，格式为dd/mm/yyyy。
 */
function getDate() {

    const date = new Date();

    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();

    const yyyy = y + "";
    const mm = ( m < 10 ? "0" : "" ) + m;
    const dd = ( d < 10 ? "0" : "" ) + d;

    return ( dd + "/" + mm + "/" + yyyy );

}

module.exports = createHtmlFile;