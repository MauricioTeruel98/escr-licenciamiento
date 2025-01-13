import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import ComponentValues from './Componentes/ComponentValues';
import ComponentComponent from './Componentes/ComponentComponent';
import ComponentIndicadores from './Componentes/ComponentIndicadores';

export default function SuperAdminComponents() {
    return (
        <SuperAdminLayout>
            <div>
                <ComponentValues/>
            </div>
            <div className='mt-10'>
                <ComponentComponent/>
            </div>
            <div className='mt-10'>
                <ComponentIndicadores/>
            </div>
        </SuperAdminLayout>
    )
}
