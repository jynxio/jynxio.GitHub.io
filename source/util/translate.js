import util from "node:util";
import shiki from "shiki";
import { readFile, writeFile } from "node:fs/promises";
import { nanoid } from "nanoid";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfm } from "micromark-extension-gfm";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { toHast } from "mdast-util-to-hast";
import { toHtml } from "hast-util-to-html";
import { parseSync } from "svgson";

const highlighter = await shiki.getHighlighter( { theme: "nord", langs: [ "javascript" ] } );
const codeMap = new Map();

const SVG_STRING_LINK = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-external-link\"><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path><polyline points=\"15 3 21 3 21 9\"></polyline><line x1=\"10\" x2=\"21\" y1=\"14\" y2=\"3\"></line></svg>";
const SVG_STRING_CHECKBOX = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-check-square\"><polyline points=\"9 11 12 14 22 4\"></polyline><path d=\"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11\"></path></svg>";
const SVG_STRING_COPY = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\"></rect><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\"></path><polyline points=\"20 6 9 17 4 12\"></polyline><line x1=\"18\" x2=\"6\" y1=\"6\" y2=\"18\"></line><line x1=\"6\" x2=\"18\" y1=\"6\" y2=\"18\"></line></svg>";
const SVG_STRING_COLLAPSE = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-chevron-down\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>";

/* TODO 如何向外传递着两份数据？ */
let h1Count = 0;    // 统计一级标题的数量
const h2Array = []; // 收集所有的二级标题

const filePath = new URL( "./promisesaplus.md", import.meta.url );
const markdown = await readFile( filePath, { encoding: "utf8" } );
const mast = fromMarkdown( markdown, {
	extensions: [ gfm() ],
	mdastExtensions: [ gfmFromMarkdown() ],
} );

processMast( mast );

const hast = toHast( mast );
let html = toHtml( hast );

writeFile( "./promiseaplus.html", html );

for ( const [ k, v ] of codeMap ) {

	const from = html.indexOf( k );
	const to = from + Array.from( k ).length;

	html = html.slice( 0, from ) + v + html.slice( to );

}

function log ( msg ) {

	console.log( util.inspect( msg, { depth: null } ) );

}

function processMast ( mast ) {

	( function deepTrave ( node, parent ) {

		switch ( node.type ) {

		case "heading":
			processHeadingNode( node );
			break;

		case "thematicBreak":
			processThematicBreakNode( node, parent );
			break;

		case "link":
			processLinkNode( node );
			break;

		case "image":
			processImageNode( node );
			break;

		case "listItem":
			processListItemNode( node );
			break;

		case "code":
			processCodeNode( node );
			break;

		default:
			break;

		}

		node.children?.forEach( child => deepTrave( child, node ) );

	} )( mast );

}

function processHeadingNode ( node ) {

	if ( node.depth > 3 ) throw new Error( "禁止使用超过三级的标题" );
	if ( node.children.length === 0 ) throw new Error( "禁止使用内容为空的标题" );
	if ( node.children.length > 1 ) throw new Error( "禁止在标题中编写非普通的文本" );

	switch ( node.depth ) {

	case 1:
		if ( h1Count > 1 ) throw new Error( "禁止使用一个以上的一级标题" ); // TODO 还需要判断是否根本就没有使用一级标题
		h1Count ++;
		return;

	case 2:
		if ( ! node.data ) node.data = {};
		if ( ! node.data.hProperties ) node.data.hProperties = {};
		node.data.hProperties.id = nanoid();
		h2Array.push( node.children[ 0 ].value ); // TODO 请检查是否会产生转义字符bug（请通过查看react-handbook页面来进行检查）
		break;

	case 3:
		break;

	default:
		break;

	}

}

function processThematicBreakNode ( node, parent ) {

	const index = parent.children.findIndex( child => child === node );

	if ( parent.children.length === 1 ) delete parent.children;
	else parent.children.splice( index, 1 );

}

function processLinkNode ( node ) {

	if ( node.children.length === 0 ) throw new Error( "禁止内容为空" );
	if ( node.children.length > 1 ) throw new Error( "禁止书写非普通文本" );

	if ( ! node.data ) node.data = {};
	if ( ! node.data.hProperties ) node.data.hProperties = {};
	if ( ! node.data.hChildren ) node.data.hChildren = [];

	node.data.hProperties.target = "_blank";
	node.data.hChildren.push( { type: "text", value: node.children[ 0 ].value } );
	node.data.hChildren.push( svg2mast( SVG_STRING_LINK ) );

}

function processImageNode ( node ) {

	node.url = "/post/image" + node.url;

}

function processListItemNode ( node ) {

	if ( node.checked === null ) return;

	const id = nanoid();

	node.children[ 0 ].children.unshift( {
		type: "root",
		data: {
			hChildren: [
				{
					type: "element",
					tagName: "input",
					properties: { id, disabled: true, type: "checkbox", checked: node.checked },
				},
				{
					type: "element",
					tagName: "label",
					properties: { for: id },
					children: [ svg2mast( SVG_STRING_CHECKBOX ) ],
				},
			],
		},
	} );
	node.checked = null;

}

function processCodeNode ( node ) {

	const uuid = nanoid();
	const preString = highlighter.codeToHtml( node.value, { lang: node.lang } );
	const from = preString.indexOf( "<code>" ) + 6;
	const to = preString.lastIndexOf( "</code>" );
	const codeString = preString.slice( from, to );
	const divString =
        "<div>" +
        `<jynx-pre data-code="${ Array.from( node.value ).map( character => character.codePointAt( 0 ) ).join() }">` + // Data-code
        "<pre slot='panel'>" +
        "<code>" + codeString + "</code>" +
        "</pre>" +
        "<button slot='collapse-button'>" + SVG_STRING_COLLAPSE + "</button>" +
        "<button slot='copy-button'>" + SVG_STRING_COPY + "</button>" +
        "</jynx-pre>" +
        "</div>";

	codeMap.set( uuid, divString );
	node.type = "text";
	node.value = uuid;

	delete node.meta;
	delete node.lang;

}

function svg2mast ( svgString ) {

	const json = parseSync( svgString );

	( function deepTrave ( json ) {

		json.tagName = json.name;
		json.properties = json.attributes;
		json.value && json.children.push( { type: "text", value: json.value } );

		delete json.name;
		delete json.attributes;
		delete json.value;

		if ( json.children.length === 0 ) delete json.children;

		json.children?.forEach( child => deepTrave( child ) );

	} )( json );

	return json;

}

function pre2mast ( codeString ) {

	return {
		type: "element",
		tagName: "div",
		children: [
			{
				type: "element",
				tagName: "jynx-pre",
				properties: { "data-code": Array.from( codeString ).map( character => character.codePointAt( 0 ) ).join() },
				children: [
					{
						type: "element",
						tagName: "pre",
						properties: { slot: "panel" },
						children: [
							{
								type: "element",
								tagName: "code",
								children: [ { type: "text", value: codeString } ],
							},
						],
					},
					{
						type: "element",
						tagName: "button",
						properties: { slot: "collapse-button" },
						children: [ svg2mast( SVG_STRING_COLLAPSE ) ],
					},
					{
						type: "element",
						tagName: "button",
						properties: { slot: "copy-button" },
						children: [ svg2mast( SVG_STRING_COPY ) ],
					},
				],
			},
		],
	};

}
