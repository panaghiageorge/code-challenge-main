import express, { json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { router } from './routes/index.mjs';
import { generateOpenAPI } from './utils/openApiDefinition.mjs';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(morgan('dev'));
app.use(json());

app.use(router);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(generateOpenAPI()));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
