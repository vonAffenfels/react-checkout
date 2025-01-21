export default `
    query ProductByIdWithImage($id: ID!) {
        product(id: $id) {
            id
            tags
            featuredImage {
                url(transform: {maxHeight: 128, maxWidth: 128, preferredContentType: WEBP})
            }
        }
    }
`;
