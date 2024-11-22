import { NotebookPanel } from '@jupyterlab/notebook';
import { IDict, ISuggestionsManager, ISuggestionsModel } from '../types';
import { ISignal, Signal } from '@lumino/signaling';
export class SuggestionsModel implements ISuggestionsModel {
  constructor(options: SuggestionsModel.IOptions) {
    this.switchNotebook(options.panel);
    this._suggestionsManager = options.suggestionsManager;
  }
  get filePath(): string {
    return this._filePath ?? '-';
  }
  get notebookSwitched(): ISignal<ISuggestionsModel, void> {
    return this._notebookSwitched;
  }
  get currentNotebookPanel(): NotebookPanel | null {
    return this._notebookPanel;
  }
  get isDisposed(): boolean {
    return this._isDisposed;
  }
  get allSuggestions(): IDict | undefined {
    return this._allSuggestions;
  }
  dispose(): void {
    if (this._isDisposed) {
      return;
    }
    this._isDisposed = true;
    Signal.clearData(this);
  }

  addSuggestion(): void {
    console.log('current', this._notebookPanel?.content.activeCell);
  }
  async switchNotebook(panel: NotebookPanel | null): Promise<void> {
    if (panel) {
      await panel.context.ready;
      this._allSuggestions = this._suggestionsManager.getAllSuggestions(panel);
    }
    this._notebookPanel = panel;
    this._filePath = this._notebookPanel?.context.localPath;
    this._notebookSwitched.emit();
  }

  private _isDisposed = false;
  private _filePath?: string;
  private _notebookPanel: NotebookPanel | null = null;
  private _notebookSwitched: Signal<this, void> = new Signal(this);
  private _allSuggestions?: IDict;
  private _suggestionsManager: ISuggestionsManager;
}

export namespace SuggestionsModel {
  export interface IOptions {
    panel: NotebookPanel | null;
    suggestionsManager: ISuggestionsManager;
  }
}
