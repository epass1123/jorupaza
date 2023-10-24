import swaggerAutogen from 'swagger-autogen';
swaggerAutogen({openapi: '3.0.0'})

const options = {
  info: {
    title: 'JORUPAZA API DOC',
    description: 'api 도큐먼트입니다',
  },
  servers: [
    {
      url: 'http://localhost:60002',
    },
  ],
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      in: 'header',
      bearerFormat: 'JWT',
    },
  },
};
const outputFile = './swagger-output.json';
const endpointsFiles = ['../server.js'];
swaggerAutogen(outputFile, endpointsFiles, options);