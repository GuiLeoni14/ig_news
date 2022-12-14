import * as prismic from '@prismicio/client';
import * as prismicNext from '@prismicio/next';
import { PreviewData } from 'next';

type TConfigTypePrismic = {
    req?: prismic.HttpRequestLike;
    previewData: PreviewData;
};
// eles comendam criar em formato de função para exportar o client do prismic pois assim terá um nova instancia para cada utilização(sempre usar um client novo)
export function getPrismicClient(config?: TConfigTypePrismic) {
    const primisc = prismic.createClient(process.env.PRISMIC_END_POINT as string, {
        accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    });
    prismicNext.enableAutoPreviews({
        client: primisc,
        previewData: config?.previewData,
        req: config?.req,
    });

    return primisc;
}
