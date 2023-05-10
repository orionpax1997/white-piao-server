import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Editor, { OnChange } from '@monaco-editor/react';
import { Source } from '@/modals/index';
import { Layout } from '@/components/index';
import {
  SEARCH_EXAMPLE,
  FIND_SERIES_EXAMPLE,
  FIND_STREAM_EXAMPLE,
  FIND_DISCOVERY_EXAMPLE,
  DISCOVERY_EXAMPLE,
} from '@/utils/script-example';

type ScriptOptions = 'search' | 'findSeries' | 'findStream' | 'findDiscovery' | 'discovery';

const tabs: { key: ScriptOptions; name: string }[] = [
  {
    key: 'search',
    name: '搜索',
  },
  {
    key: 'findSeries',
    name: '获取剧集',
  },
  {
    key: 'findStream',
    name: '获取视频流',
  },
  {
    key: 'findDiscovery',
    name: '获取发现',
  },
  {
    key: 'discovery',
    name: '发现',
  },
];

const initScriptEditorData = {
  script: '',
  input: '',
  inputLabel: '',
  inputError: false,
  output: '',
  testing: false,
  saving: false,
  canSave: false,
  ok: false,
};

export default function SearchScript() {
  const router = useRouter();
  const { id } = router.query;
  const [activedOption, setActivedOption] = useState<ScriptOptions>('search');
  const [source, setSource] = useState<Source>(new Source());
  const { data: session } = useSession();
  const [scriptEditorData, setScriptEditorData] = useState<{
    [key in ScriptOptions]: {
      script: string;
      input: string;
      inputLabel: string;
      inputError: boolean;
      output: string;
      testing: boolean;
      saving: boolean;
      canSave: boolean;
      ok: boolean;
    };
  }>({
    search: { ...initScriptEditorData, inputLabel: '关键字' },
    findSeries: { ...initScriptEditorData, inputLabel: '目录页地址' },
    findStream: { ...initScriptEditorData, inputLabel: '播放页地址' },
    findDiscovery: { ...initScriptEditorData },
    discovery: { ...initScriptEditorData, inputLabel: '发现页地址' },
  });

  useEffect(() => {
    const loadSource = async () => {
      const res = await fetch(`/api/sources/${id}`);
      const source: Source = await res.json();
      setSource(source);
      setScriptEditorData({
        search: {
          ...scriptEditorData.search,
          script: source.searchScript ? source.searchScript : SEARCH_EXAMPLE,
        },
        findSeries: {
          ...scriptEditorData.findSeries,
          script: source.findSeriesScript ? source.findSeriesScript : FIND_SERIES_EXAMPLE,
        },
        findStream: {
          ...scriptEditorData.findStream,
          script: source.findStreamScript ? source.findStreamScript : FIND_STREAM_EXAMPLE,
        },
        findDiscovery: {
          ...scriptEditorData.findDiscovery,
          script: source.findDiscoveryScript ? source.findDiscoveryScript : FIND_DISCOVERY_EXAMPLE,
        },
        discovery: {
          ...scriptEditorData.discovery,
          script: source.discoveryScript ? source.discoveryScript : DISCOVERY_EXAMPLE,
        },
      });
    };
    if (id && !source.objectId) {
      loadSource();
    }
  }, [id, scriptEditorData, source.objectId]);

  return (
    <Layout>
      <Tabs activedKey={activedOption} tabs={tabs} onActivedKeyChange={setActivedOption} />
      <ScriptEditor
        {...scriptEditorData[activedOption]}
        onScriptChange={value => {
          setScriptEditorData({
            ...scriptEditorData,
            [activedOption]: {
              ...scriptEditorData[activedOption],
              script: value,
              canSave: false,
            },
          });
        }}
        onInputChange={value =>
          setScriptEditorData({
            ...scriptEditorData,
            [activedOption]: {
              ...scriptEditorData[activedOption],
              input: value,
              inputError: false,
            },
          })
        }
        onTest={async () => {
          if (scriptEditorData[activedOption].inputLabel && !scriptEditorData[activedOption].input) {
            setScriptEditorData({
              ...scriptEditorData,
              [activedOption]: {
                ...scriptEditorData[activedOption],
                inputError: true,
              },
            });
            return;
          }
          setScriptEditorData({
            ...scriptEditorData,
            [activedOption]: {
              ...scriptEditorData[activedOption],
              testing: true,
            },
          });
          const res = await fetch(`/api/run/${activedOption}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              script: scriptEditorData[activedOption].script,
              input: scriptEditorData[activedOption].input,
            }),
          });
          const json = await res.json();
          if (res.status === 200 && activedOption === 'search') {
            fetch('/api/sources', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                objectId: source.objectId,
                searchTime: json.time,
              }),
            });
          }
          setScriptEditorData({
            ...scriptEditorData,
            [activedOption]: {
              ...scriptEditorData[activedOption],
              output: JSON.stringify(json, null, 2),
              testing: false,
              canSave:
                res.status === 200 &&
                (source.author === session?.user?.name || session?.user?.name === process.env.NEXT_PUBLIC_GITHUB_ADMIN),
              ok: res.status === 200,
            },
          });
        }}
        onSave={async () => {
          setScriptEditorData({
            ...scriptEditorData,
            [activedOption]: {
              ...scriptEditorData[activedOption],
              saving: true,
            },
          });
          await fetch('/api/sources', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...source,
              status: source.status
                ? source.status
                : scriptEditorData.search.ok && scriptEditorData.findSeries.ok && scriptEditorData.findStream.ok
                ? 1
                : 0,
              searchScript: activedOption === 'search' ? scriptEditorData.search.script : source.searchScript,
              findSeriesScript:
                activedOption === 'findSeries' ? scriptEditorData.findSeries.script : source.findSeriesScript,
              findStreamScript:
                activedOption === 'findStream' ? scriptEditorData.findStream.script : source.findStreamScript,
              findDiscoveryScript:
                activedOption === 'findDiscovery' ? scriptEditorData.findDiscovery.script : source.findDiscoveryScript,
              discoveryScript:
                activedOption === 'discovery' ? scriptEditorData.discovery.script : source.discoveryScript,
            }),
          });
          alert('保存成功');
          setScriptEditorData({
            ...scriptEditorData,
            [activedOption]: {
              ...scriptEditorData[activedOption],
              saving: false,
              canSave: false,
            },
          });
          setSource({
            ...source,
            status: source.status
              ? source.status
              : (scriptEditorData.search.ok && scriptEditorData.findSeries.ok && scriptEditorData.findStream.ok) ||
                (scriptEditorData.findDiscovery.ok && scriptEditorData.discovery.ok)
              ? 1
              : 0,
            searchScript: activedOption === 'search' ? scriptEditorData.search.script : source.searchScript,
            findSeriesScript:
              activedOption === 'findSeries' ? scriptEditorData.findSeries.script : source.findSeriesScript,
            findStreamScript:
              activedOption === 'findStream' ? scriptEditorData.findStream.script : source.findStreamScript,
            findDiscoveryScript:
              activedOption === 'findDiscovery' ? scriptEditorData.findDiscovery.script : source.findDiscoveryScript,
            discoveryScript: activedOption === 'discovery' ? scriptEditorData.discovery.script : source.discoveryScript,
          });
        }}
      />
      ;
    </Layout>
  );
}

const Tabs = ({
  tabs,
  activedKey,
  onActivedKeyChange,
}: {
  tabs: { key: ScriptOptions; name: string }[];
  activedKey: string;
  onActivedKeyChange: (activedKey: ScriptOptions) => void;
}) => {
  return (
    <div className="tabs">
      {tabs.map(tab => (
        <a
          key={tab.key}
          className={`tab tab-bordered ${activedKey === tab.key && 'tab-active'}`}
          onClick={() => {
            if (activedKey !== tab.key) {
              onActivedKeyChange(tab.key);
            }
          }}
        >
          {tab.name}
        </a>
      ))}
    </div>
  );
};

const ScriptEditor = ({
  script,
  input,
  inputLabel,
  inputError,
  output,
  testing,
  saving,
  canSave,
  onScriptChange,
  onInputChange,
  onTest,
  onSave,
}: {
  script: string;
  input: string;
  inputLabel: string;
  inputError: boolean;
  output: string;
  testing: boolean;
  saving: boolean;
  canSave: boolean;
  onScriptChange: OnChange;
  onInputChange: (input: string) => void;
  onTest: () => void;
  onSave: () => void;
}) => {
  return (
    <div className="grid grid-cols-3 gap-2 py-2 flex-1">
      <div className="col-span-2 rounded-md overflow-hidden">
        <Editor theme="vs-dark" defaultLanguage="javascript" value={script} onChange={onScriptChange} />
      </div>
      <div className="flex flex-col justify-around">
        <div className="text-xl font-bold">输出</div>
        <div className={`${inputLabel ? 'h-[60vh]' : 'h-[72vh]'} rounded-md overflow-hidden`}>
          <Editor
            theme="vs-dark"
            defaultLanguage="json"
            value={output}
            options={{
              readOnly: true,
            }}
          />
        </div>
        {inputLabel && (
          <>
            <div className="text-xl font-bold">输入</div>
            <input
              type="text"
              placeholder={`请输入${inputLabel}`}
              className="input input-bordered"
              value={input}
              onChange={e => onInputChange(e.target.value)}
            />
            {inputError && <span className="text-error">输入不能为空！</span>}
          </>
        )}
        <div className="flex justify-end gap-2">
          <button className={`btn btn-primary w-1/3 ${testing && 'loading'}`} onClick={onTest}>
            测试
          </button>
          <button
            className={`btn btn-accent w-1/3 ${!canSave && 'btn-disabled'} ${saving && 'loading'}`}
            onClick={onSave}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};
