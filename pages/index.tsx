import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Layout } from '@/components/index';
import { Source } from '@/modals/index';
import Link from 'next/link';

type FormValues = {
  objectId?: string;
  name?: string;
  baseURL?: string;
};

export default function SourceManage() {
  const [number, setNumber] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [byPage, setByPage] = useState<{ [number: number]: [Source] }>({});
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [listNeedReload, setListNeedReload] = useState(false);

  const [formValues, setFormValues] = useState<FormValues>({});
  const [formShow, setFormShow] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const loadPage = async () => {
      setLoading(true);
      const res = await fetch(
        '/api/sources?' + new URLSearchParams({ number: number.toString(), pageSize: '10', keyword }).toString()
      );
      const json = await res.json();
      setByPage({ ...byPage, [number]: json.list });
      setTotalElements(json.totalElements);
      setLoading(false);
    };

    if ((!byPage[number] || listNeedReload) && !loading) {
      if (listNeedReload) {
        setNumber(0);
        setByPage({});
        setListNeedReload(false);
      }
      loadPage();
    }
  }, [number, byPage, keyword, listNeedReload, loading]);

  const onSubmit: SubmitHandler<FormValues> = async data => {
    setFormLoading(true);
    await fetch('/api/sources', {
      method: data.objectId ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    setFormLoading(false);
    setFormShow(false);
    setListNeedReload(true);
  };

  return (
    <Layout>
      <div className="flex gap-3">
        <SearchForm keyword={keyword} onKeywordChange={v => setKeyword(v)} onSearch={() => setListNeedReload(true)} />
        <label
          htmlFor="add-modal"
          className="btn modal-button btn-primary"
          onClick={() => {
            setFormValues({});
            setFormShow(true);
          }}
        >
          新增
        </label>
      </div>
      <SourceTable
        number={number}
        totalElements={totalElements}
        byPage={byPage}
        loading={loading}
        onPageChange={setNumber}
        onEditClick={source => {
          setFormValues(source);
          setFormShow(true);
        }}
      />
      <SourceForm
        show={formShow}
        submitting={formLoading}
        formValues={formValues}
        onSubmit={onSubmit}
        onClose={() => setFormShow(false)}
      />
    </Layout>
  );
}

const SearchForm = ({
  keyword,
  onKeywordChange,
  onSearch,
}: {
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  onSearch: (keyword: string) => void;
}) => {
  return (
    <div className="form-control">
      <div className="input-group">
        <input
          type="text"
          placeholder="Search…"
          className="input input-bordered"
          value={keyword}
          onChange={e => onKeywordChange(e.target.value)}
        />
        <button className="btn btn-square" onClick={() => onSearch(keyword)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const SourceTable = ({
  number,
  totalElements,
  byPage,
  loading,
  onPageChange,
  onEditClick,
}: {
  number: number;
  totalElements: number;
  byPage: { [number: number]: [Source] };
  loading: boolean;
  onPageChange: (number: number) => void;
  onEditClick: (source: Source) => void;
}) => {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>序号</th>
              <th>网站名称</th>
              <th>网站地址</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              byPage[number] &&
              byPage[number].map((item, index) => (
                <tr className="h-16" key={item.objectId}>
                  <th>{number * 10 + index + 1}</th>
                  <td>{item.name}</td>
                  <td>
                    <a className="link link-accent" href={item.baseURL} target="_blank" rel="noreferrer">
                      {item.baseURL}
                    </a>
                  </td>
                  <td>
                    {item.status === 0 ? (
                      <div className="badge badge-outline badge-warning">维护中</div>
                    ) : item.status === 1 ? (
                      <div className="badge badge-outline badge-secondary">审核中</div>
                    ) : item.status === 2 ? (
                      <div className="badge badge-outline badge-accent">使用中</div>
                    ) : item.status === 3 ? (
                      <div className="badge badge-outline badge-ghost">停用</div>
                    ) : null}
                  </td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-sm" onClick={() => onEditClick(item)}>
                        修改
                      </button>
                      <Link href={`/sources/${item.objectId}/scripts`}>
                        <button className="btn btn-sm">表达式维护</button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {loading && (
          <div
            role="status"
            className="px-4 rounded border border-gray-200 divide-y divide-gray-200 shadow animate-pulse dark:divide-gray-700 md:px-6 dark:border-gray-700"
          >
            {Array.from(Array(10).keys()).map(i => (
              <div key={i} className={`flex justify-between items-center h-16 `}>
                <div>
                  <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-32 mb-2.5"></div>
                  <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="btn-group mx-auto w-1/2 grid grid-cols-2">
        <button className={`btn btn-outline ${number < 1 && 'btn-disabled'}`} onClick={() => onPageChange(number - 1)}>
          上一页
        </button>
        <button
          className={`btn btn-outline ${totalElements <= 10 * (number + 1) && 'btn-disabled'}`}
          onClick={() => onPageChange(number + 1)}
        >
          下一页
        </button>
      </div>
    </>
  );
};

const SourceForm = ({
  show,
  submitting,
  formValues,
  onSubmit,
  onClose,
}: {
  show: boolean;
  submitting: boolean;
  formValues: FormValues;
  onSubmit: SubmitHandler<FormValues>;
  onClose: () => void;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    reset(formValues);
  }, [formValues, reset]);

  const FormField = ({ label, field, required }: { label: string; field: 'name' | 'baseURL'; required: boolean }) => {
    return (
      <>
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
        <input
          type="text"
          className={`input input-bordered ${errors[field] && 'input-error'}`}
          {...register(field, { required })}
        />
        {errors[field] && <span className="text-error">{label}不能为空！</span>}
      </>
    );
  };

  return (
    <>
      <input type="checkbox" id="add-modal" className="modal-toggle" checked={show} onChange={() => null} />
      <div className="modal">
        <div className="modal-box">
          <label htmlFor="add-modal" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={onClose}>
            ✕
          </label>
          <div className="form-control">
            <FormField label={'网站名称'} field={'name'} required={true} />
            <FormField label={'网站地址'} field={'baseURL'} required={true} />
            <button className={`btn btn-primary mt-3 ${submitting && 'loading'}`} onClick={handleSubmit(onSubmit)}>
              提交
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
