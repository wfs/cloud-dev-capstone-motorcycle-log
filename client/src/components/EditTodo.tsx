import * as React from "react";
import { Form, Button } from "semantic-ui-react";
import Auth from "../auth/Auth";
import { getUploadUrl, uploadFile } from "../api/todos-api";

// import Resizer from "react-image-file-resizer";

enum UploadState {
  /**
   * Set of named String constants providing State.
   * https://www.typescriptlang.org/docs/handbook/enums.html
   */
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile
}

interface EditTodoProps {
  match: {
    params: {
      todoId: string;
    };
  };
  auth: Auth;
}

interface EditTodoState {
  file: any;
  uploadState: UploadState;
}

export class EditTodo extends React.PureComponent<
  EditTodoProps,
  EditTodoState
> {
  state: EditTodoState = {
    file: undefined,
    uploadState: UploadState.NoUpload
  };

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    this.setState({
      file: files[0]
    });
  };

  /**
   * Events handle submit of file upload.
   * @param event
   */
  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      if (!this.state.file) {
        alert("File should be selected");
        return;
      }

      this.setUploadState(UploadState.FetchingPresignedUrl);
      const uploadUrl = await getUploadUrl(
        this.props.auth.getIdToken(),
        this.props.match.params.todoId
      );

      this.setUploadState(UploadState.UploadingFile);
      // TODO: resize image file
      // ...
      // Resizer.imageFileResizer(
      //   this.state.file,
      //   300,
      //   300,
      //   "JPEG",
      //   100,
      //   0,
      //   uri => {
      //     console.log(uri);
      //   }
      // );

      await uploadFile(uploadUrl, this.state.file);

      alert("File was uploaded!");
    } catch (e) {
      alert("Could not upload a file: " + e.message);
    } finally {
      this.setUploadState(UploadState.NoUpload);
    }
  };

  /**
   * Sets file upload state
   * @param uploadState
   */
  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    });
  }

  render() {
    return (
      <div>
        <h1>Upload new image</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    );
  }

  renderButton() {
    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && (
          <p>Uploading image metadata</p>
        )}
        {this.state.uploadState === UploadState.UploadingFile && (
          <p>Uploading file</p>
        )}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    );
  }
}
