package activator;

import org.osgi.framework.*;
import org.osgi.service.http.HttpService;
import org.osgi.service.http.NamespaceException;

public class Activator implements BundleActivator, ServiceListener {

	private BundleContext bundleContext;
	private HttpService httpService;

	public void start(BundleContext bundleContext) throws Exception {
		this.bundleContext = bundleContext;
		String httpServiceFilter = String.format("(objectClass=%s)", HttpService.class.getName());
		ServiceReference[] httpServiceRefs = bundleContext.getServiceReferences(null, httpServiceFilter);
		if (httpServiceRefs != null) {
			registerResources(httpServiceRefs[0]);
		} else {
			bundleContext.addServiceListener(this, httpServiceFilter);
		}
	}

	public void stop(BundleContext bundleContext) throws Exception {
		if (httpService != null) {
			httpService.unregister("/a");
		}
	}

	public void serviceChanged(ServiceEvent event) {
		if (event.getType() == ServiceEvent.REGISTERED) {
			registerResources(event.getServiceReference());
		}
	}

	void registerResources(ServiceReference httpServiceRef) {
		try {
			System.out.println("注册/AppFrame");
			httpService = (HttpService) bundleContext.getService(httpServiceRef);
			httpService.registerResources("/app", "/myapp", null);
		} catch (NamespaceException e) {
			System.err.println("Error while registering resources: " + e);
		}
	}

}
