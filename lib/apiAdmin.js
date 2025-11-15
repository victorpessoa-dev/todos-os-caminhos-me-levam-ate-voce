export async function createPost(postData) {
    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao criar post');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao criar post:', error);
        throw error;
    }
}

export async function updatePost(postData) {
    try {
        const response = await fetch('/api/posts', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao atualizar post');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao atualizar post:', error);
        throw error;
    }
}

export async function deletePost(id) {
    try {
        const response = await fetch('/api/posts', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao deletar post');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao deletar post:', error);
        throw error;
    }
}

export async function updateAbout(aboutData) {
    try {
        const response = await fetch('/api/about', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(aboutData),
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar informações');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao atualizar sobre:', error);
        throw error;
    }
}

export async function addGalleryImage(imageData) {
    try {
        const response = await fetch('/api/gallery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(imageData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao adicionar imagem');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao adicionar imagem:', error);
        throw error;
    }
}

export async function deleteGalleryImage(id) {
    try {
        const response = await fetch('/api/gallery', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao deletar imagem');
        }

        return true;
    } catch (error) {
        console.error('Erro ao deletar imagem:', error);
        throw error;
    }
}