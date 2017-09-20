const fetch = require('node-fetch');
const Promise = require('bluebird');
const {
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLInt,
	GraphQLString,
	GraphQLList
} = require('graphql');

const parseXml = Promise.promisify(require('xml2js').parseString);
fetch(
  'https://www.goodreads.com/author/show/18541?format=xml&key=ovxiy4r0ygPP7IJ1hlo2A'
)
.then(response => response.text())
.then(parseXml);

const BookType = new GraphQLObjectType({
	name: 'Book',
	description: '...',	
	fields: () => ({
		title: {
			type: GraphQLString,
			resolve: xml => xml.title[0]		
		},
		isbn: {
			type: GraphQLString,
			resolve: xml => xml.isbn[0],
		}
	})
})
const AuthorType = new GraphQLObjectType({
	name: 'Author',
	description: '...',

	fields: () => ({
		name: {
			type: GraphQLString,
			resolve: xml => (
				xml.GoodreadsResponse.author[0].name[0]
			)
		},
		books: {
			type: new GraphQLList(BookType),
			resolve: xml => xml.GoodreadsResponse.author[0].books[0].book
		}
	})
})

//Schema
module.exports = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		description: '...',
		fields: () => ({
			author: {
				type: AuthorType,
				args: {
					id: { type: GraphQLInt }
				},
				resolve: (root, args) => fetch(
					`https://www.goodreads.com/author/show/${args.id}?format=xml&key=ovxiy4r0ygPP7IJ1hlo2A`
				)
				.then(response => response.text())
				.then(parseXml)
			},
		})
	})
})