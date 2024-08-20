import axios from "axios";
import Cookies from "js-cookie"

// const proxy = 'http://localhost:8000';
const proxy = 'https://sckgbackend-5d3940a40c50.herokuapp.com';

class Api {
    async post(path, item) {
		try {
		    //console.log(path)
			//console.log(proxy + path)
			const res = await axios.post(path,item);
			const res_data = await res.data;
			//console.log(res.data);
			return res_data;
		} catch (err) {
			console.log(err);
		}

	}

	async put(path, item) {
		try {
			const res = await axios.put(path,item);
			const res_data = await res.data;
			return res_data;
		} catch (err) {
			console.log(err);
		}

	}

	async delete(path) {
		try {
			const res = await axios.delete(path);
			const res_data = await res.data;
			//console.log(res.data);
			return res_data;
		} catch (err) {
			console.log(err);
		}
  	}

	async get(path) {
		try {
			const res = await axios.get(proxy + path);
			const res_data = await res.data;
			return res_data;
		} catch (err) {
			console.log(err);
		}
	}

    login = async (username, password) => {
        let data = await this.post(`/user/login/`, {username, password});

        if(data && data.errorCode === 0){
            const cookies = data["cookies"]
            Cookies.set("user", cookies["user"])
            Cookies.set("username", cookies["username"])
            Cookies.set("id", cookies["id"])
        }

        return data;
    }
	
	logout = async () => {
		//403 : user is not logged in
		let data = await this.get(`/user/logout/`);
		if (data["errorCode"] === 0) {
			Cookies.remove("user")
			Cookies.remove("user_username")
			Cookies.remove("user_id")
		}
		return data;
	}

	getAccount = async (id) => {
		let data = await this.get(`/user/account/${id}/`);
		return data;
	}

	deleteAccount = async (id) => {
		let data = await this.delete(`/user/account/${id}/delete/`);
		return data;
	}

	accountChangePassword = async (id, password) => {
		let data = await this.put(`/user/account/${id}/change/`, {password})
		return data;
	}

	getAdmin = async (id) => {
		let data = await this.get(`/user/admin/${id}/`);
		return data;
	}

	deleteAdmin = async (id) => {
		let data = await this.delete(`/user/admin/${id}/delete/`);
		return data;
	}

	adminChangePassword = async (id, password) => {
		let data = await this.put(`/user/admin/${id}/change/`, {password})
		return data;
	}

    getAdminList = async () => {
        let data = await this.get(`/user/admins/`);
        return data;
    }

    createAccount = async (username, password, gender) => {
        let data = await this.post(`/user/account/create/`, {username, password, gender});
        return data;
    }

	createAdmin = async (username, password, gender) => {
        let data = await this.post(`/user/admin/create/`, {username, password, gender});
        return data;
    }

	editUsername = async (id, username) => {
        let data = await this.post(`/user/${id}/edit/username/`, {id, username});
        return data;
    }

	editGender = async (id, gender) => {
		let data = await this.post(`/user/${id}/edit/gender/`, {id, gender});
		return data;
	}

	getTextList = async () => {
        let data = await this.get(`/text/`);
        return data;
    }

	getText = async (textId) => {
        let data = await this.get(`/text/${textId}/`);
        return data;
    }

	createText = async (text, username, json_created) => {
        let data = await this.post(`/text/create/`, {text, username, json_created});
        return data;
    }

	getTriples = async () => {
		let data = await this.get(`/triples/`);
		return data;
	}

	deleteText = async (textId) => {
		let data = await this.delete(`/text/${textId}/delete/`);
		return data;
	}

	calculateTextSimilarity = async() => {
		let data = await this.post(`/text/similarity/`);
		return data;
	}

	getFileList = async () => {
        let data = await this.get(`/file/`);
        return data;
    }

	getFileInfo = async (infoId) => {
		let data = await this.get(`/file/${infoId}/`);
		return data;
	}

	getFile = async (infoId) => {
		let data = await this.get(`/file/${infoId}/file/`);
		return data;
	}

	createFileInfo = async (name, username, json_created) => {
		let data = await this.post(`/file/create/info/`, {name, username, json_created});
		return data;
	}

	uploadFile = async (infoId, form) => {
		// let data = await this.post(`/file/create/`, {file, fileName})
		// return data;
		let data = await axios({
			method: 'post',
			url: `/file/create/${infoId}/file/`,
			data: form,
		});

		return data;
	}

	deleteFile = async(fileId) => {
		let data = await this.delete(`/file/${fileId}/delete/`);
		return data;
	}

	extractFile = async(form) => {
		let data = await axios({
			method: 'post',
			url: `/file/extract/file/`,
			data: form,
		});

		return data;
	}
}

const api = new Api()

export default api;