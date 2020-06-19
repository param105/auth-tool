const Query = {
  greeting: () => 'Hello GraphQL  From TutorialsPoint !!',
  sayHello: (args) => `Hi ${args.name} GraphQL server says Hello to you!!`,
}
module.exports = { Query }
